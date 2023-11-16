import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getProducts1, ProductsResponse1 } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { productId: string };
  }
): Promise <NextResponse<ProductsResponse1> | {}> {
  if (!Types.ObjectId.isValid(params.productId)) {
    return NextResponse.json({}, { status: 400 });
  }

  const product = await getProducts1(params.productId);

  if (product === null) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(product);
}