import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth";

function generateOrderNumber(): string {
  const now = new Date();
  const prefix = "IMP";
  const seq = now.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${seq}-${rand}`;
}

function buildTimeline(order: typeof ordersTable.$inferSelect) {
  const steps = [
    { label: "Order Placed", description: "Your order was received and confirmed.", done: true },
    { label: "Processing", description: "Your item is being prepared and packed.", done: false },
    { label: "Shipped", description: "Your order is on its way.", done: false },
    { label: "Out for Delivery", description: "Package is with the delivery courier.", done: false },
    { label: "Delivered", description: "Package delivered to your address.", done: false },
  ];

  const status = order.status as string;
  const statusOrder = ["processing", "shipped", "out_for_delivery", "delivered"];
  const statusIndex = statusOrder.indexOf(status);

  return steps.map((s, i) => {
    if (i === 0) return { ...s, done: true, active: false, date: order.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) };
    if (i === 1 && statusIndex >= 0) {
      const d = new Date(order.createdAt);
      d.setDate(d.getDate() + 1);
      return { ...s, done: true, active: false, date: d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) };
    }
    if (i === 2 && statusIndex >= 1) {
      const d = new Date(order.createdAt);
      d.setDate(d.getDate() + 3);
      return { ...s, done: true, active: false, date: d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) };
    }
    if (i === 3 && statusIndex >= 2) {
      const d = new Date(order.createdAt);
      d.setDate(d.getDate() + 4);
      return { ...s, done: true, active: false, date: d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) };
    }
    if (i === 4 && statusIndex >= 3) {
      const d = new Date(order.createdAt);
      d.setDate(d.getDate() + 4);
      return { ...s, done: true, active: true, date: d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) };
    }
    if (i === 1 && statusIndex === -1) return { ...s, done: false, active: false, date: "—" };
    if (status === "processing") return { ...s, done: false, active: i === 1, date: "—" };
    if (status === "shipped") return { ...s, done: false, active: i === 3, date: "—" };
    if (status === "out_for_delivery") return { ...s, done: false, active: i === 4, date: "—" };
    return { ...s, done: false, active: false, date: "—" };
  });
}

const createOrderBody = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  shippingAddress: z.string().min(1),
  totalAmount: z.number().min(1),
  items: z.array(
    z.object({
      name: z.string(),
      variant: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(1),
    })
  ),
  currency: z.string().default("PHP"),
});

const router = Router();

router.post("/orders", requireAuth, async (req, res) => {
  const parsed = createOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
    return;
  }

  const body = parsed.data;
  const userId = req.user!.id;

  const orderNumber = generateOrderNumber();

  const [order] = await db
    .insert(ordersTable)
    .values({
      orderNumber,
      userId,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      totalAmount: body.totalAmount,
      currency: body.currency,
      shippingAddress: body.shippingAddress,
      items: JSON.stringify(body.items),
      status: "processing",
    })
    .returning();

  res.status(201).json({
    orderNumber: order.orderNumber,
    status: order.status,
    totalAmount: order.totalAmount,
    currency: order.currency,
    createdAt: order.createdAt,
    timeline: buildTimeline(order),
  });
});

router.get("/orders", requireAuth, async (req, res) => {
  const userId = req.user!.id;
  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userId, userId))
    .orderBy(ordersTable.createdAt);

  res.json(
    orders.map((o) => ({
      orderNumber: o.orderNumber,
      status: o.status,
      totalAmount: o.totalAmount,
      currency: o.currency,
      createdAt: o.createdAt,
      items: JSON.parse(o.items as string),
      timeline: buildTimeline(o),
    }))
  );
});

router.get("/orders/:orderNumber", async (req, res) => {
  const { orderNumber } = req.params;
  const rows = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.orderNumber, orderNumber.toUpperCase()))
    .limit(1);

  if (rows.length === 0) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const order = rows[0];
  res.json({
    orderNumber: order.orderNumber,
    status: order.status,
    totalAmount: order.totalAmount,
    currency: order.currency,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt,
    items: JSON.parse(order.items as string),
    timeline: buildTimeline(order),
  });
});

export default router;
