import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getUser, UserResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  }
): Promise <NextResponse<UserResponse> | {}> {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({}, { status: 400 });
  }

  const user = await getUser(params.userId);

  if (user === null) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(user);
}