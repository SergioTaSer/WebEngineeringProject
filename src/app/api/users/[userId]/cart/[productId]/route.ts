import { UpdateCartItemResponse, updateCartItem } from '@/lib/handlers';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { NonNullChain } from 'typescript';
import { CartResponse, removeFromCart } from '@/lib/handlers';


import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; productId: string };
  }
): Promise<NextResponse<UpdateCartItemResponse> | null | {}> {
  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({}, { status: 400 });
  }
  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }
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

  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }
  
  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }
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