"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!product.inStock}
      className="btn-primary flex-1"
    >
      {added ? (
        <>
          <Check className="h-4 w-4" />
          Sepete Eklendi
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" />
          Sepete Ekle
        </>
      )}
    </button>
  );
}
