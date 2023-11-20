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

 
  

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        My Shopping Cart
      </h3>
      {cartItemsData.cartItems.length === 0 ? (
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
            <button className="mx-1 bg-gray-300 p-2 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            </button>
            <p className="bg-white p-2 rounded w-20">{cartItem.qty}</p>
            <button className="mx-1 bg-gray-300 p-2 rounded">
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
      


     
      <a className="block mx-auto mt-4 bg-blue-500 text-white p-3 rounded-lg" href="/checkout">Checkout</a>


     
    </div>
  );
}




