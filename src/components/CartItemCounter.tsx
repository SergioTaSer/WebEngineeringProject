'use client';

import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CartItemsContext } from '@/providers/CartItemsProvider';
import { useContext } from 'react';

interface CartItemCounterProps {
  productId: string;
  }

  export default function CartItemCounter({
  productId,
  }: CartItemCounterProps) {
    const { data: session } = useSession({ required: true });
    const { cartItems, updateCartItems } = useContext(CartItemsContext);
    const [isUpdating, setIsUpdating] = useState(false);

    const cartItem = cartItems.find((cartItem) =>
    cartItem.product._id === productId
    );
    const qty = cartItem ? cartItem.qty : 0;

    const onPlusBtnClick = async function (event: React.MouseEvent) {
      setIsUpdating(true);
    
      try {
        const res = await fetch(
          `/api/users/${session!.user._id}/cart/${productId}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              qty: qty + 1,
            }),
          }
        );
    
        if (res.ok) {
          const body = await res.json();
          updateCartItems(body.cartItems);
        }
      } finally {
        setIsUpdating(false);
      }
    };


    return(
        <>
          {cartItems.length === 0}
            <div className='border p-2 text-center'>
              <div className='flex items-center justify-center'>
                <button onClick={onPlusBtnClick} className="mx-1 bg-gray-300 p-2 rounded"
                disabled={!session || isUpdating}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                </button>
                <p className="bg-white p-2 rounded w-20">{qty}</p>
                <button  className="mx-1 bg-gray-300 p-2 rounded"
                
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
                  </svg>
                </button>
                <button className="mx-1 bg-red-300 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                </button>
              </div>
            </div>
          
       
        </>
    );

}