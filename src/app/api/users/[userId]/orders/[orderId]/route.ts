import { getOrder1, OrderResponse } from '@/lib/handlers';
import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Types } from 'mongoose';


export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; orderId: string };
  }
): Promise<NextResponse<OrderResponse> | {}> {
  if (!Types.ObjectId.isValid(params.userId) || !Types.ObjectId.isValid(params.orderId)) {
    return NextResponse.json({}, { status: 400 });
  }

  const order = await getOrder1(params.userId, params.orderId);

  if (order === null) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(order);
}

  