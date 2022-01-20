import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Prisma, PrismaClient } from '@prisma/client';

import type { IttyRequest } from '..';
import { jsonResponse } from '../utils/response';
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
const handleError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
};

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
export const GetAuthState = async ({ headers }: IttyRequest): Promise<Response> => {
  // Valid cookie access?
  const cookiePayload = verifyCookie(headers.get('Cookie'));

  if (!cookiePayload) {
    const response = jsonResponse({ auth: false });

    response.headers.set('Set-Cookie', clearCookie());

    return response;
  }

  // Retrieve the db user
  const db = new PrismaClient();

  const user = await db.user.findUnique({
    where: { id: cookiePayload.userId },
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

export const SignIn = async (request: IttyRequest): Promise<Response> => {
  // TODO: Use zod?
  let requestBody: SignInParams | undefined;

  try {
    requestBody = await request.json<SignInParams>();
  } catch (error) {
    return new Response('Expected JSON not supplied', { status: 422 });
  }

  const { email, password } = requestBody;

  if (!email || !password) {
    return new Response('Email or password not supplied', {
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
      return new Response('Invalid email or password', {
        status: 401,
      });
    }

    // Then, check the password
    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isCorrectPassword) {
      return new Response('Invalid email or password', {
        status: 401,
      });
    }

    // Add the JWT cookie to the header & return the user
    const response = jsonResponse(user);

    response.headers.set(
      'Set-Cookie',
      createJwtCookie({
        userId: user.id,
        email: user.email,
      })
    );

    return response;
  } catch (error) {
    const errorMessage = handleError(error);

    return new Response(errorMessage, { status: 502 });
  }
};

export const Register = async (request: IttyRequest): Promise<Response> => {
  // TODO: Use zod?
  let requestBody: RegisterParams | undefined;

  try {
    requestBody = await request.json<RegisterParams>();
  } catch (error) {
    return new Response('Expected JSON not supplied', { status: 422 });
  }

  const { name, email, password } = requestBody;

  if (!name || !email || !password) {
    return new Response('Name, email or password not supplied', { status: 422 });
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
    const response = jsonResponse(user);

    response.headers.set(
      'Set-Cookie',
      createJwtCookie({
        userId: user.id,
        email: user.email,
      })
    );

    return response;
  } catch (error) {
    // Handle Prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return new Response('An account already exists with that email', { status: 422 });
        default:
          return new Response(error.message, { status: 500 });
      }
    }

    // Unknown error
    const errorMessage = handleError(error);

    return new Response(errorMessage, { status: 502 });
  }
};

export const UpdateAccount = async (request: IttyRequest): Promise<Response> => {
  // Get ID
  const id = request.params ? request.params.id : undefined;

  if (!id) {
    return new Response('User ID param not supplied', { status: 422 });
  }

  // Get request body
  // TODO: Use zod?
  let requestBody: AccountParams | undefined;

  try {
    requestBody = await request.json<AccountParams>();
  } catch (error) {
    return new Response('Expected JSON not supplied', { status: 422 });
  }

  const { name, email, password } = requestBody;

  if (!id || !name || !email) {
    return new Response('Name or email not supplied', { status: 422 });
  }

  // Check access
  const cookiePayload = verifyCookie(request.headers.get('Cookie'));

  if (!cookiePayload) {
    return new Response('You must be signed in to update account details', { status: 401 });
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
        id: id.toString(),
      },
    });

    // Add the JWT cookie to the header
    const response = jsonResponse(user);

    response.headers.set(
      'Set-Cookie',
      createJwtCookie({
        userId: user.id,
        email: user.email,
      })
    );

    return response;
  } catch (error) {
    // Handle Prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return new Response('An account already exists with that email', { status: 422 });
        default:
          return new Response(error.message, { status: 500 });
      }
    }

    // Unknown error
    const errorMessage = handleError(error);

    return new Response(errorMessage, { status: 502 });
  }
};

export const SignOut = (): Response => {
  return new Response('Signed Out', {
    headers: {
      'Set-Cookie': clearCookie(),
    },
  });
};
