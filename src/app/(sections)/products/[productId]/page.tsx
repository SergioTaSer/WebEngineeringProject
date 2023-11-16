import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProducts1 } from '@/lib/handlers';

export default async function Product({
  params,
}: {
  params: { productId: string };
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
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
          alt={product.price.toString()}
          className='mt-4 h-60 w-full object-cover object-center group-hover:opacity-75'
        />
        <p className="text-lg text-gray-700 mt-4">
          Precio: {product.price}
        </p>
      </div>
      <div className="flex-1 ml-4 max-w-md">
        <div className="mt-6 text-md text-center text-gray-500 dark:text-black-800">
          {product.description}
        </div>
      </div>
    </div>
  );
  
  
  
}