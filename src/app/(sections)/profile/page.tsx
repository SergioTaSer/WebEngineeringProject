import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { UserResponse, getUser } from '@/lib/handlers';
import {OrderResponse, getOrder } from '@/lib/handlers';

import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Profile() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  const UserData: UserResponse | null = await getUser(
    session.user._id
  );

  if (!UserData) {
    notFound();
  }

  if (!session) {
    redirect('/api/auth/signin');
  }
  
 const data = await getOrder(session.user._id);

  if (data === null) {
    console.log("Error");
    notFound();
  }


  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-4 lg:pb-7'>
        User Profile
      </h3>
      {UserData.email == null ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>El usuario no existe</span>
        </div>
      ) : (
        <div>
      
<div className='flex items-center'>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
    <h6 className='text-lg font-bold'>Full Name:</h6>
    <p>{UserData.name} {UserData.surname}</p>
  </div>

  <div className='flex items-center'>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
  <h6 className='text-lg font-bold'>E-mail address:</h6>
  <p>{UserData.email}</p>
</div>

<div className='flex items-center'>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
    <h6 className='text-lg font-bold'>Address:</h6>
    <p>{UserData.address}</p>
       </div>

       <div className='flex items-center'>
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
</svg>
<h6 className='text-lg font-bold'>Birthday:</h6>
    <p>{UserData.birthdate.toDateString()}</p>

</div>
<div className='mb-4'></div>
<h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-4 lg:pb-7'>
  Orders
</h3>
<table className='w-full border'>
  <thead>
    <tr>
      <th className='bg-gray-200 text-left border p-2'>Order Id</th>
      <th className='bg-gray-200 border p-2'>Shipment Address</th>
      <th className='bg-gray-200 border p-2'>Payment Information</th>
      <th className='bg-gray-200 border p-2'></th>
    </tr>
  </thead>
  <tbody>
    {data.orders.map((order:any) => (
       <tr key={order.product} className='border'>
        <td className='border p-2'>
        <Link href={`/orders/${order._id}`}>
            <p className='mt-2 text-xl font-bold text-blue-300'>
              {order._id}
            </p>
       </Link>
        </td>
        <td className='border p-2 text-center'>
          <div className='flex items-center justify-center'>
            
            <p className=" p-2 rounded">{order.address}</p>
           
            
          </div>
        </td>
        <td className='border p-2 text-center'>
  <div className='flex flex-col items-center justify-center'>
    <p className="p-1 rounded font-bold">{order.cardHolder}</p>
    <p className="p-1 rounded">{order.cardNumber}</p>
  </div>
</td>


    <td className='border p-2 text-center'>
      <div className='flex items-center justify-center'>
        <Link href={`/orders/${order._id}`}>
          <p className="p-2 rounded">View details</p>
        </Link>
      </div>
    </td>
  </tr>
))}



  </tbody>
</table>
       </div>

       
      )}
  </div>  
  
  );
      }



    