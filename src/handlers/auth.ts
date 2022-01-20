import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

import type { IttyRequest } from '..';
import { buildErrorResponse, buildResponse } from '../utils/response';
import { clearCookie, createJwtCookie } from '../utils/auth';
import type { CookieParams } from '../utils/auth';

// Types
type SignInParams = {
  email?: string;
  password?: string;
};

type RegisterParams = {
  name?: string;
  email?: string;
  password?: string;
};

type AccountParams = {
  name?: string;
  email?: string;
  password?: string;
};

// Helpers
const verifyCookie = (header: string | null): CookieParams | undefined => {
  // Does the supplied header exist?
  if (!header) {
    return;
  }

  // Do we have the JWT token?
  const cookies = cookie.parse(header);

  if (!cookies.jwt) {
    return;
  }

  // Is it a valid token?
  const payload = jwt.verify(cookies.jwt, JWT_SECRET);

  if (!payload || typeof payload === 'string') {
    return;
  }

  // Retrieve the user ID
  const { userId, email } = payload;

  if (!userId || !email) {
    return;
  }

  // All good
  return {
    userId,
    email,
  };
};

// Handlers
export const GetAuthState = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Valid cookie access?
  const cookiePayload = verifyCookie(request.headers.get('Cookie'));

  if (!cookiePayload) {
    const response = buildResponse({
      body: { auth: false },
      origin,
    });

    response.headers.set('Set-Cookie', clearCookie());

    return response;
  }

  // Retrieve the db user
  const db = new PrismaClient();

  const user = await db.user.findUnique({
    where: { id: cookiePayload.userId },
  });

  if (!user) {
    const response = buildResponse({
      body: { auth: false },
      origin,
    });

    response.headers.set('Set-Cookie', clearCookie());

    return response;
  }

  // All ok, return the user
  return buildResponse({
    body: {
      auth: true,
      user,
    },
    origin,
  });
};

export const SignIn = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // TODO: Use zod?
  let requestBody: SignInParams | undefined;

  try {
    requestBody = await request.json<SignInParams>();
  } catch (error) {
    return buildResponse({
      body: 'Expected JSON not supplied',
      origin,
      status: 422,
    });
  }

  const { email, password } = requestBody;

  if (!email || !password) {
    return buildResponse({
      body: 'Email or password not supplied',
      origin,
      status: 422,
    });
  }

  try {
    // First, find the user
    const db = new PrismaClient();

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return buildResponse({
        body: 'Invalid email or password',
        origin,
        status: 401,
      });
    }

    // Then, check the password
    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isCorrectPassword) {
      return buildResponse({
        body: 'Invalid email or password',
        origin,
        status: 401,
      });
    }

    // Add the JWT cookie to the header & return the user
    const response = buildResponse({
      body: user,
      origin,
    });

    response.headers.set(
      'Set-Cookie',
      createJwtCookie({
        userId: user.id,
        email: user.email,
      })
    );

    return response;
  } catch (error) {
    return buildErrorResponse({ error, origin, status: 502 });
  }
};

export const Register = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // TODO: Use zod?
  let requestBody: RegisterParams | undefined;

  try {
    requestBody = await request.json<RegisterParams>();
  } catch (error) {
    return buildResponse({
      body: 'Expected JSON not supplied',
      origin,
      status: 422,
    });
  }

  const { name, email, password } = requestBody;

  if (!name || !email || !password) {
    return buildResponse({
      body: 'Name, email or password not supplied',
      origin,
      status: 422,
    });
  }

  try {
    // Hash supplied password and create the user
    const passwordHash = await bcrypt.hash(password, 10);

    const db = new PrismaClient();

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    // Add the JWT cookie to the header
    const response = buildResponse({
      body: user,
      origin,
    });

    response.headers.set(
      'Set-Cookie',
      createJwtCookie({
        userId: user.id,
        email: user.email,
      })
    );

    return response;
  } catch (error) {
    return buildErrorResponse({ error, origin });
  }
};

export const UpdateAccount = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Validate params
  if (!request.params?.email) {
    return buildResponse({
      body: 'Email param not supplied',
      origin,
      status: 422,
    });
  }

  // Get request body
  // TODO: Use zod?
  let requestBody: AccountParams | undefined;

  try {
    requestBody = await request.json<AccountParams>();
  } catch (error) {
    return buildResponse({
      body: 'Expected JSON not supplied',
      origin,
      status: 422,
    });
  }

  const { name, email, password } = requestBody;

  if (!name || !email) {
    return buildResponse({
      body: 'Name or email not supplied',
      origin,
      status: 422,
    });
  }

  // Check access
  const cookiePayload = verifyCookie(request.headers.get('Cookie'));

  if (!cookiePayload) {
    return buildResponse({
      body: 'You must be signed in to update account details',
      origin,
      status: 401,
    });
  }

  // Update the user details
  try {
    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

    const db = new PrismaClient();

    const user = await db.user.update({
      data: {
        name,
        email,
        ...(passwordHash && { passwordHash }),
      },
      where: {
        email: request.params.email,
      },
    });

    // Add the JWT cookie to the header
    const response = buildResponse({
      body: user,
      origin,
    });

    response.headers.set(
      'Set-Cookie',
      createJwtCookie({
        userId: user.id,
        email: user.email,
      })
    );

    return response;
  } catch (error) {
    return buildErrorResponse({ error, origin });
  }
};

export const SignOut = (request: Request): Response => {
  const origin = request.headers.get('origin');

  const response = buildResponse({
    body: 'Signed Out',
    origin,
  });

  response.headers.set('Set-Cookie', clearCookie());

  return response;
};
