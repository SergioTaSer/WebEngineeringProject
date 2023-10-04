import { NextRequest, NextResponse } from 'next/server';
import { createOrder, CreateOrderResponse } from '@/lib/handlers';

export async function POST(
  request: NextRequest
): Promise <NextResponse<CreateOrderResponse> | {}>{
  const body = await request.json();

  if (!body.address || !body.cardHolder || !body.cardNumber) {
    return NextResponse.json({}, { status: 400 });
  }

  const orderId = await createOrder(body);

  if (orderId === null) {
    return NextResponse.json({}, { status: 400 });
  }

  const headers = new Headers();
  headers.append('Location', `/api/orders/${orderId._id}`);
  return NextResponse.json({ _id: orderId._id }, { status: 201, headers: headers });
}