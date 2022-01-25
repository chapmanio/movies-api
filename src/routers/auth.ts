import { Router } from 'itty-router';

import {
  DeleteAccount,
  GetAuthState,
  Register,
  SignIn,
  SignOut,
  UpdateAccount,
} from '../handlers/auth';

export const authRouter = Router({ base: '/api/auth' });

authRouter
  .get('/', GetAuthState)
  .post('/sign-in', SignIn)
  .post('/register', Register)
  .post('/account/:email', UpdateAccount)
  .post('/delete/:email', DeleteAccount)
  .post('/sign-out', SignOut);
