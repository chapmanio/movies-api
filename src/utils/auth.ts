import jwt from 'jsonwebtoken';
import cookie from 'cookie';

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
    secure: true,
    httpOnly: true,
    path: '/',
  });
  return jwtCookie;
};

export const clearCookie = (): string => {
  return 'jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};
