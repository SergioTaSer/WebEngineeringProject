import { UpdateCartItemResponse, updateCartItem } from '@/lib/handlers';

import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { NonNullChain } from 'typescript';

export async function PUT(
    request: NextRequest,
    {
      params,
    }: {
      params: { userId: string; productId: string };
    }
  ): Promise<NextResponse<UpdateCartItemResponse> | null | {}> {
    const body = await request.json();
  
    if (!body.qty || !params.userId || !params.productId) {
      return NextResponse.json({}, { status: 400 });
    }
  
    if (params.userId == null || params.productId == null) {
      return NextResponse.json({}, { status: 400 });
    }
  
    const output = await updateCartItem(
      params.userId,
      params.productId,
      body.qty
    );
  
    const cartItems = output?.cartItems;
    const created = output?.created;
  
    if (cartItems === null) return NextResponse.json({}, { status: 400 });
  
    if (created) return NextResponse.json(cartItems, { status: 201 });
    else return NextResponse.json(cartItems, { status: 200 });
  }