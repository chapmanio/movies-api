import { Router } from 'itty-router';

import { GetAuthState } from '../handlers/auth';

export const authRouter = Router({ base: '/api/auth' });

authRouter.get('/', GetAuthState);
