import { NextRequest, NextResponse } from 'next/server';
import { createUser, CreateUserResponse } from '@/lib/handlers';

export async function POST(
  request: NextRequest
): Promise <NextResponse<CreateUserResponse> | {}>{
  const body = await request.json();

  if (!body.email || !body.password || !body.name || !body.surname || !body.address || !body.birthdate) {
    return NextResponse.json({}, { status: 400 });
  }

  const userId = await createUser(body);

  if (userId === null) {
    return NextResponse.json({}, { status: 400 });
  }

  const headers = new Headers();
  headers.append('Location', `/api/users/${userId._id}`);
  return NextResponse.json({ _id: userId._id }, { status: 201, headers: headers });
}