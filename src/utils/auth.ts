import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export const createJwtCookie = (userId: string, email: string): string => {
  const token = jwt.sign({ userId, email }, JWT_SECRET, {
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
