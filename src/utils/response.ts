import { Prisma } from '@prisma/client';

// Types
type ResponseParams = {
  body: string | unknown;
  origin?: string | null;
  status?: number;
};

type ErrorResponseParams = {
  error: unknown;
  origin?: string | null;
  status?: number;
};

type FetchExternalParams = {
  request: Request;
  origin?: string | null;
};

// Helpers
const buildCorsHeaders = (origin?: string | null) => {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
  };
};

export const buildResponse = ({ body, origin, status }: ResponseParams): Response => {
  let responseBody: string;
  let jsonHeader: Record<string, string> | undefined;

  if (typeof body === 'string') {
    responseBody = body;
  } else {
    responseBody = JSON.stringify(body);
    jsonHeader = { 'Content-Type': 'application/json' };
  }

  return new Response(responseBody, {
    status,
    headers: {
      ...buildCorsHeaders(origin),
      ...jsonHeader,
    },
  });
};

export const buildErrorResponse = ({ error, origin }: ErrorResponseParams): Response => {
  // Handle Prisma error
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return buildResponse({
          body: 'An account already exists with that email',
          origin,
          status: 422,
        });
      default:
        return buildResponse({
          body: error.message,
          origin,
          status: 400,
        });
    }
  }

  // Handle general errors
  let errorMessage = 'An unknown error occurred';

  if (typeof error === 'string') {
    errorMessage = error;
  }

  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return buildResponse({
    body: errorMessage,
    origin,
    status: 500,
  });
};

export const fetchExternal = async ({
  request,
  origin,
}: FetchExternalParams): Promise<Response> => {
  try {
    const response = await fetch(request);

    // Is it a JSON response?
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const json = await response.json();

      return buildResponse({ body: json, origin });
    }

    // Just a text response
    const text = await response.text();

    return buildResponse({ body: text, origin });
  } catch (error) {
    return buildErrorResponse({ error, origin });
  }
};
