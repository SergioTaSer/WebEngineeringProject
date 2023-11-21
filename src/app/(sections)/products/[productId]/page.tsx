import { Types } from 'mongoose';
import { notFound, redirect } from 'next/navigation';
import { getProducts1 } from '@/lib/handlers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { Session } from 'next-auth';
import { CartResponse, getCart } from '@/lib/handlers';

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
    <div className='flex-auto content-normal flex'>
      <div className="flex-1 max-w-md">
        <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-4 lg:pb-7'>
          {product.name}
        </h3>
        <img
          src={product.img}
          className='mt-4 h-60 w-full object-cover object-center overflow-hidden rounded-lg bg-gray-200'
        />
        <p className='mt-1 text-xxl font-medium text-center dark:text-black-900' style={{ fontSize: '3em' }}>
          {product.price + ' €'}
        </p>
        
        <div className='flex items-center justify-center'>
            <button className="mx-1 bg-gray-300 p-2 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            </button>
            
              <div className="flex items-center justify-center">
                <p className="bg-white p-2 rounded w-20 text-center ">{productCartItem!==undefined? productCartItem.qty:0}</p>
                <button className="mx-1 bg-gray-300 p-2 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
                  </svg>
                </button>
              </div>
          

            <button className="mx-2 bg-red-300 p-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            </button>
          </div>
      </div>
      
      <div className="flex-1 ml-4 max-w-md">
        <div className="md:flex md:flex-col mt-20 text-2xl font-bold overflow-hidden dark:text-black-900">
          Product Details
        </div>

        <div className="md:flex md:flex-col mt-10 text-md dark:text-black-900">
          {product.description}
        </div>

      </div>

      
    </div>






  );
}