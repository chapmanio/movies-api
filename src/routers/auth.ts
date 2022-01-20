import { Router } from 'itty-router';

import { GetAuthState, Register, SignIn, SignOut, UpdateAccount } from '../handlers/auth';

export const authRouter = Router({ base: '/api/auth' });

authRouter
  .get('/', GetAuthState)
  .post('/sign-in', SignIn)
  .post('/register', Register)
  .patch('/account/:id', UpdateAccount)
  .post('/sign-out', SignOut);
