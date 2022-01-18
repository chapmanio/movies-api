import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

import { jsonResponse } from '../utils/response';
import { clearCookie } from '../utils/auth';

export const GetAuthState = async ({ headers }: Request): Promise<Response> => {
  // Any cookies at all?
  const cookieHeaders = headers.get('Cookie');

  if (!cookieHeaders) {
    return jsonResponse({ auth: false });
  }

  // Do we have the JWT token?
  const cookies = cookie.parse(cookieHeaders);

  if (!cookies.jwt) {
    return jsonResponse({ auth: false });
  }

  // Is it a valid token?
  const payload = jwt.verify(cookies.jwt, JWT_SECRET);

  if (!payload) {
    return new Response('Invalid Authorization token', {
      status: 401,
    });
  }

  // Retrieve the user ID
  if (typeof payload === 'string') {
    return new Response('Invalid JWT payload', {
      status: 401,
    });
  }

  const { userId } = payload;

  if (!userId) {
    const response = jsonResponse({ auth: false });

    response.headers.set('Set-Cookie', clearCookie());

    return response;
  }

  // Retrieve the db user
  const db = new PrismaClient();

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const response = jsonResponse({ auth: false });

    response.headers.set('Set-Cookie', clearCookie());

    return response;
  }

  return jsonResponse({
    auth: true,
    user,
  });
};
