import { NextRequest, NextResponse } from 'next/server';
import { createOrder, CreateOrderResponse, createOrderwithid } from '@/lib/handlers';
import { getOrder, OrderResponse } from '@/lib/handlers';
import mongoose, { Types } from 'mongoose';


export async function POST(
    request: NextRequest,
    {
      params,
    }: {
      params: {userId: string };
    }
  ): Promise <NextResponse<CreateOrderResponse> | {}>{
  const body = await request.json();

  if (!body.address || !body.cardHolder || !body.cardNumber) {
    return NextResponse.json({}, { status: 400 });
  }

  
  if (params.userId === null) {
    return NextResponse.json({}, { status: 404 });
  }
  const orderId = await createOrderwithid({
    address: body.address,
    cardHolder: body.cardHolder,
    cardNumber: body.cardNumber,
    userId: params.userId,
  });
  

  if (orderId === null) {
    return NextResponse.json({}, { status: 400 });
  }

  const headers = new Headers();
  headers.append('Location', `/api/orders/${orderId._id}`);
  return NextResponse.json({ _id: orderId._id }, { status: 201, headers: headers });
}


export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  }
): Promise<NextResponse<OrderResponse> | {}> {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({}, { status: 400 });
  }

  const order = await getOrder(params.userId);

  if (order === null) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(order);
}

