import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { STATIC_PRODUCTS } from "@/data/static-products";

export interface CartItem {
  productId: string;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  variantId: string;
  quantity: number;
  price: number;
  currencyCode: string;
  imageUrl: string | null;
}

export interface Cart {
  id: string;
  lines: CartItem[];
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
}

const CART_KEY = "imperial-local-cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function buildCart(items: CartItem[]): Cart {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const currencyCode = items[0]?.currencyCode ?? "PHP";
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return {
    id: "local-cart",
    lines: items,
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toFixed(2), currencyCode },
      totalAmount: { amount: totalAmount.toFixed(2), currencyCode },
    },
  };
}

export function useLocalCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const cart = buildCart(items);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addToCart = useCallback(
    (variantId: string, quantity: number = 1) => {
      setIsLoading(true);
      const product = STATIC_PRODUCTS.find((p) =>
        p.variants.some((v) => v.id === variantId)
      );
      if (!product) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      const variant = product.variants.find((v) => v.id === variantId)!;
      setItems((prev) => {
        const existing = prev.find((i) => i.variantId === variantId);
        if (existing) {
          return prev.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            productHandle: product.handle,
            productTitle: product.title,
            variantTitle: variant.title,
            variantId: variant.id,
            quantity,
            price: parseFloat(variant.price.amount),
            currencyCode: variant.price.currencyCode,
            imageUrl: product.featuredImage?.url || null,
          },
        ];
      });
      toast({
        title: "Added to cart",
        description: `${product.title} — ${variant.title} added.`,
      });
      setIsLoading(false);
    },
    [toast]
  );

  const updateQuantity = useCallback(
    (variantId: string, quantity: number) => {
      setItems((prev) => {
        if (quantity <= 0) return prev.filter((i) => i.variantId !== variantId);
        return prev.map((i) =>
          i.variantId === variantId ? { ...i, quantity } : i
        );
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    clearCart,
  };
}
