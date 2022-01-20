import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Constants
const COOKIE_OPTIONS: cookie.CookieSerializeOptions = {
  secure: true,
  httpOnly: true,
  path: '/',
  sameSite: 'none',
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

export const clearCookie = (): string => {
  const jwtCookie = cookie.serialize('jwt', 'deleted', {
    ...COOKIE_OPTIONS,
    expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'),
  });

  return jwtCookie;
};
