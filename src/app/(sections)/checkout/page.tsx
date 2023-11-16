import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { CartResponse, getCart } from '@/lib/handlers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Cart() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  const cartItemsData: CartResponse | null = await getCart(session.user._id);

  if (!cartItemsData) {
    notFound();
  }

  const isCartEmpty = cartItemsData.cartItems.length === 0;
  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        My Shopping Cart
      </h3>

      {isCartEmpty ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      ) : (
        <table className='w-full border mb-4'>
          <thead>
            <tr>
              <th className='bg-gray-200 text-left border p-2'>Product Name</th>
              <th className='bg-gray-200 border p-2'>Quantity</th>
              <th className='bg-gray-200 border p-2'>Price</th>
              <th className='bg-gray-200 border p-2'>Total</th>
            </tr>
          </thead>
          <tbody>
            {cartItemsData.cartItems.map((cartItem) => (
              <tr key={cartItem.product._id.toString()} className='border'>
                <td className='border p-2'>
                  <Link href={`/products/${cartItem.product._id}`}>
                    <p className='mt-2 text-xl font-bold text-blue-300'>
                      {cartItem.product.name}
                    </p>
                  </Link>
                </td>
                <td className='border p-2 text-center'>
                  <div className='flex items-center justify-center'>
                    <p>{cartItem.qty}</p>
                  </div>
                </td>
                <td className='border p-2'>{cartItem.product.price.toFixed(2) + ' €'}</td>
                <td className='border p-2'>{(cartItem.qty * cartItem.product.price).toFixed(2) + ' €'}</td>
              </tr>
            ))}
            <tr className='border'>
              <td className='border p-2'>Total</td>
              <td className='border'></td>
              <td className='border'></td>
              <td className='border p-2'>
                {cartItemsData.cartItems.reduce((total, cartItem) => total + cartItem.qty * cartItem.product.price, 0).toFixed(2) + ' €'}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      <div className='w-full pb-4 mt-4'>
        <label htmlFor='shippingAddress' className='block text-sm font-medium text-gray-700'>
          Shipping Address
        </label>
        <input
          type='text'
          id='shippingAddress'
          name='shippingAddress'
          className='mt-1 p-2 w-full border rounded-md'
          placeholder='221b Baker St, London, UK'
        />
      </div>

      <div className='flex pb-4'>
        <div className='w-1/2 pr-2'>
          <label htmlFor='cardHolder' className='block text-sm font-medium text-gray-700'>
            Card Holder
          </label>
          <input
            type='text'
            id='cardHolder'
            name='cardHolder'
            className='mt-1 p-2 w-full border rounded-md'
            placeholder='Foo Bar'
          />
        </div>
        <div className='w-1/2 pl-2'>
          <label htmlFor='cardNumber' className='block text-sm font-medium text-gray-700'>
            Card Number
          </label>
          <input
            type='text'
            id='cardNumber'
            name='cardNumber'
            className='mt-1 p-2 w-full border rounded-md'
            placeholder='0000111122223333'
          />
        </div>
      </div>
      {!isCartEmpty && (
        <a className="block mx-auto mt-4 bg-blue-500 text-white p-3 rounded-lg" href="#">Purchase</a>
      )}
     

    </div>
  );
}
