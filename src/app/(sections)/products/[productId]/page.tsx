import { Types } from 'mongoose';
import { notFound, redirect } from 'next/navigation';
import { getProducts1 } from '@/lib/handlers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { Session } from 'next-auth';
import { CartResponse, getCart } from '@/lib/handlers';
import CartItemCounter from '@/components/CartItemCounter';

export default async function Product({
  params,
}: {
  params: { productId: string };
}) {

  if (!Types.ObjectId.isValid(params.productId)) {
    notFound();
  }

  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  const cartItemsData: CartResponse | null = await getCart(session.user._id);

  const productCartItem = cartItemsData?.cartItems.find((cartItem) => cartItem.product._id == params.productId) 





  if (!cartItemsData) {
    notFound();
  }
  
 

  const product = await getProducts1(params.productId);

  if (product === null) {
    notFound();
  }

  return (
    <div className='flex flex-col sm:flex-row'>
      <div className="flex-1 sm:w-1/2">
        <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-4 lg:pb-2'>
          {product.name}
        </h3>
        <img
          src={product.img}
          className='mt-4 h-80 w-full object-cover object-center overflow-hidden rounded-lg bg-gray-200'
        />
        <p className='mt-3 text-3xl font-small text-center text-black-400 sm:text-4xl'>
          {product.price + ' €'}
        </p>
        <CartItemCounter productId={params.productId} />
      </div>
  
      <div className="flex-1 ml-4">
        <div className="mt-20 text-2xl font-bold overflow-hidden dark:text-black-900">
          Product Details
        </div>
        <div className="mt-5 text-lg overflow-hidden dark:text-black-900">
          {product.description}
        </div>
      </div>
    </div>
  );
  
}