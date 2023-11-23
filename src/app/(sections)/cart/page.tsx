import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { CartResponse, getCart } from '@/lib/handlers';
import Link from 'next/link';
import CartItemsList from '@/components/CartItemsList';

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
     
      <CartItemsList/>


     
      <a className="block mx-auto mt-4 bg-blue-500 text-white p-3 rounded-lg" href="/checkout">Checkout</a>


     
    </div>
  );
}




