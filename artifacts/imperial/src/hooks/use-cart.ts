import { useEffect, useState, useCallback } from "react";
import { useCreateCart, useGetCart, useAddCartLine, useUpdateCartLine, useRemoveCartLine } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const CART_STORAGE_KEY = "imperial-cart-id";

export function useCart() {
  const [cartId, setCartId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      setCartId(stored);
    }
  }, []);

  const cartQuery = useGetCart(cartId || "", {
    query: { enabled: !!cartId, queryKey: ["cart", cartId] }
  });

  const createCart = useCreateCart();
  const addLine = useAddCartLine();
  const updateLine = useUpdateCartLine();
  const removeLine = useRemoveCartLine();

  const addToCart = useCallback(async (merchandiseId: string, quantity: number = 1) => {
    try {
      if (!cartId) {
        // Create new cart
        const newCart = await createCart.mutateAsync({
          data: {
            lines: [{ merchandiseId, quantity }]
          }
        });
        setCartId(newCart.id);
        localStorage.setItem(CART_STORAGE_KEY, newCart.id);
        toast({
          title: "Added to cart",
          description: "Your item has been added to the cart.",
        });
      } else {
        // Add to existing cart
        await addLine.mutateAsync({
          cartId,
          data: { merchandiseId, quantity }
        });
        cartQuery.refetch();
        toast({
          title: "Added to cart",
          description: "Your item has been added to the cart.",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive"
      });
    }
  }, [cartId, createCart, addLine, cartQuery, toast]);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (!cartId) return;
    try {
      if (quantity === 0) {
        await removeLine.mutateAsync({ cartId, lineId });
      } else {
        await updateLine.mutateAsync({
          cartId,
          lineId,
          data: { quantity }
        });
      }
      cartQuery.refetch();
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not update cart quantity.",
        variant: "destructive"
      });
    }
  }, [cartId, updateLine, removeLine, cartQuery, toast]);

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading || createCart.isPending || addLine.isPending || updateLine.isPending || removeLine.isPending,
    addToCart,
    updateQuantity
  };
}
