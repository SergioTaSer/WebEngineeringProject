import { getOrder1, OrderResponse } from '@/lib/handlers';
import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Types } from 'mongoose';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; orderId: string };
  }
): Promise<NextResponse<OrderResponse> | {}> {

  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }

  if (!Types.ObjectId.isValid(params.userId) || !Types.ObjectId.isValid(params.orderId)) {
    return NextResponse.json({}, { status: 400 });
  }

  const order = await getOrder1(params.userId, params.orderId);

  if (order === null) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(order);
}

  