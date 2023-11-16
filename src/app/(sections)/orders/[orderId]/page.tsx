import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getOrder1 } from '@/lib/handlers';
import { Order } from '@/models/Order';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import {CartResponse, getCart } from '@/lib/handlers';
import Link from 'next/link';





export default async function Order({
  params,
}: {
  params: { orderId: string };
}) {
  if (!Types.ObjectId.isValid(params.orderId)) {
    notFound();
  }
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }
  const cartItemsData: CartResponse | null = await getCart(session.user._id);

  if (!cartItemsData) {
    notFound();
  }
  const data = await getOrder1(session.user._id, params.orderId);

  if (data === null) {
    console.log("Error");
    notFound();
  }

  return (
    <div className='flex flex-col content-normal'>

<h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-4 lg:pb-7'>
  Order Details
</h3>

<div key={data._id} className='mb-4'>

  <div className='flex items-center'>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
    <h6 className='text-lg font-bold'>Order ID:</h6>
    <p>{data._id}</p>
  </div>

  <div className='flex items-center'>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
    <h6 className='text-lg font-bold'>Shipping Address:</h6>
    <p>{data.address}</p>
  </div>

  <div className='flex items-center'>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
    <h6 className='text-lg font-bold'>Payment Information:</h6>
    <p>{data.cardNumber} ({data.cardHolder})</p>
  </div>

  <div className='flex items-center'>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
    <h6 className='text-lg font-bold'>Date of Purchase:</h6>
    <p>{data.date.toString()}</p>
  </div>


</div>
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
    {data.orderItems.map((order:any) => (
      <tr key={order.product._id.toString()} className='border'>
        <td className='border p-2'>
          <Link href={`/products/${order.product._id}`}>
            <p className='mt-2 text-xl font-bold text-blue-300'>
              {order.product.name}
            </p>
          </Link>
        </td>
        <td className='border p-2 text-center'>
          <div className='flex items-center justify-center'>
            
            <p className=" p-2 rounded">{order.qty}</p>
           
            
          </div>
        </td>
        <td className='border p-2'>{order.price.toFixed(2) + ' €'}</td>
        <td className='border p-2'>{(order.qty * order.price).toFixed(2) + ' €'}</td>
      </tr>
    ))}
    <tr className='border'>
      <td className='border p-2'>Total</td>
      <td className='border'></td>
      <td className='border'></td>
      <td className='border p-2'>
        {data.orderItems.reduce((total, orderItem) => total + orderItem.qty * orderItem.price, 0).toFixed(2) + ' €'}
      </td>
    </tr>
  </tbody>
</table>

    </div>
  );
}




