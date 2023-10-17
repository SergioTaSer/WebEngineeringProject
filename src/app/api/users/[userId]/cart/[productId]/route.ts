import { UpdateCartItemResponse, updateCartItem } from '@/lib/handlers';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { NonNullChain } from 'typescript';
import { CartResponse, removeFromCart } from '@/lib/handlers';

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; productId: string };
  }
): Promise<NextResponse<UpdateCartItemResponse> | null | {}> {
  const body = await request.json();

  if (
    !Types.ObjectId.isValid(params.userId) ||
    !Types.ObjectId.isValid(params.productId) ||
    body.qty <= 0
  ) {
    return NextResponse.json({}, { status: 400 });
  }

  const output = await updateCartItem(
    params.userId,
    params.productId,
    body.qty
  );

  if (!output || !output.cartItems) {
    return NextResponse.json({}, { status: 404 });
  }

  if (output.created) {
    return NextResponse.json(output.cartItems, { status: 201 });
  } else {
    return NextResponse.json(output.cartItems, { status: 200 });
  }
}


export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; productId: string };
  }
): Promise<NextResponse> {
  if (
    !Types.ObjectId.isValid(params.userId) ||
    !Types.ObjectId.isValid(params.productId)
  ) {
    return new NextResponse('Invalid userId or productId', { status: 400 });
  }

  try {
    const output = await removeFromCart(params.userId, params.productId);

    if (!output || !('cartItems' in output)) {
      return new NextResponse('Cart not found', { status: 404 });
    }

    
    const jsonResponse = {
      cartItems: output.cartItems,
    };

  
    const responseBody = JSON.stringify(jsonResponse);

    return new NextResponse(responseBody, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}