import { pgTable, serial, integer, text, timestamp, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const orderStatusEnum = z.enum([
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 32 }).notNull().unique(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  status: text("status").notNull().default("processing"),
  totalAmount: integer("total_amount").notNull(),
  currency: varchar("currency", { length: 8 }).notNull().default("PHP"),
  shippingAddress: text("shipping_address").notNull(),
  items: text("items").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const orderTimelineSchema = z.array(
  z.object({
    label: z.string(),
    description: z.string(),
    date: z.string(),
    done: z.boolean(),
    active: z.boolean(),
  })
);

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Order = typeof ordersTable.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
