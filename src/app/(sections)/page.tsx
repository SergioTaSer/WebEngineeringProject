import ProductTile from '@/components/ProductTile';
import { Product } from '@/models/Product';
import { getProducts, ProductsResponse } from '@/lib/handlers';

export const dynamic = 'force-dynamic';

export default async function Index() {
  const data: ProductsResponse = await getProducts();

  return (
    <div className='flex flex-col'>
      <div className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
        {data.products.map((product: Product) => (
          <ProductTile key={product._id!.toString()} product={product} />
        ))}
      </div>
    </div>
  );
}