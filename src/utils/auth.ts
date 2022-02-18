import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Constants
const COOKIE_OPTIONS: cookie.CookieSerializeOptions = {
  secure: true,
  httpOnly: true,
  path: '/',
  sameSite: 'none',
  domain: COOKIE_DOMAIN,
};

// Types
export type CookieParams = {
  userId: string;
  email: string;
};

// Handlers
export const createJwtCookie = (cookieData: CookieParams): string => {
  const token = jwt.sign(cookieData, JWT_SECRET, {
    expiresIn: '10 days',
  });

  const jwtCookie = cookie.serialize('jwt', token, {
    ...COOKIE_OPTIONS,
  });

  return jwtCookie;
};

export const verifyCookie = (header: string | null): CookieParams | undefined => {
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

export const clearCookie = (): string => {
  const jwtCookie = cookie.serialize('jwt', 'deleted', {
    ...COOKIE_OPTIONS,
    expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'),
  });

  return jwtCookie;
};
