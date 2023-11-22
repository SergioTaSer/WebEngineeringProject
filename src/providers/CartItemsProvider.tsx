'use client';

import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  qty: number;
}

interface ICartItemsContext {
  cartItems: CartItem[];
  updateCartItems: (newCartItems: CartItem[]) => void;
}

export const CartItemsContext = createContext<ICartItemsContext>({
  cartItems: [],
  updateCartItems: () => {},
});

interface CartItemsProviderProps {
  children?: React.ReactNode;
}

export const CartItemsProvider = function ({
  children,
}: CartItemsProviderProps) {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const updateCartItems = useCallback((newCartItems: CartItem[]) => {
    setCartItems((prevCartItems: CartItem[]) =>
      newCartItems.map((newCartItem) => {
        const prevCartItem = prevCartItems.find(
          (cartItem) => cartItem.product._id === newCartItem.product._id
        );
        if (prevCartItem && prevCartItem.qty === newCartItem.qty) {
          return prevCartItem;
        } else {
          return newCartItem;
        }
      })
    );
  }, []);

  useEffect(() => {
    if (session) {
      const fetchData = async function () {
        const res = await fetch(`/api/users/${session.user._id}/cart`);
        const body = await res.json();
        setCartItems(body.cartItems);
      };

      fetchData().catch(console.error);
    } else {
      setCartItems([]);
    }
  }, [session]);

  return (
    <CartItemsContext.Provider value={{ cartItems, updateCartItems }}>
      {children}
    </CartItemsContext.Provider>
  );
};