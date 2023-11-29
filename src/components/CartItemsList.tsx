'use client';

import { CartItemsContext } from '@/providers/CartItemsProvider';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import CartItemCounter from './CartItemCounter';


export default function CartItemsList() {

    const {cartItems, updateCartItems} = useContext(CartItemsContext);

    return(
        <>
        {cartItems.length === 0 ? (
            <div className='text-center' >
              <span className='text-sm text-gray-400'>The cart</span>
            </div>
          ) : (
            <table className='w-full border'>
      <thead>
        <tr>
          <th className='bg-gray-200 text-left border p-2'>Product Name</th>
          <th className='bg-gray-200 border p-2'>Quantity</th>
          <th className='bg-gray-200 border p-2'>Price</th>
          <th className='bg-gray-200 border p-2'>Total</th>
        </tr>
      </thead>
      <tbody>
        {cartItems.map((cartItem) => (
          <tr key={cartItem.product._id.toString()} className='border'>
            <td className='border p-2'>
              <Link href={`/products/${cartItem.product._id}`}>
                <p className='mt-2 text-xl font-bold text-blue-300'>
                  {cartItem.product.name}
                </p>
              </Link>
            </td>
            
            <CartItemCounter
              productId={cartItem.product._id.toString()}
              />
            <td className='border p-2'>{cartItem.product.price.toFixed(2) + ' €'}</td>
            <td className='border p-2'>{(cartItem.qty * cartItem.product.price).toFixed(2) + ' €'}</td>
          </tr>
        ))}
        <tr className='border'>
          <td className='border p-2'>Total</td>
          <td className='border'></td>
          <td className='border'></td>
          <td className='border p-2'>
            {cartItems.reduce((total, cartItem) => total + cartItem.qty * cartItem.product.price, 0).toFixed(2) + ' €'}
          </td>
        </tr>
      </tbody>
    </table>
    
    
    
    
    )}
    </>
    );

}