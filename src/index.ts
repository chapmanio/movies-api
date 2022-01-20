import { Router } from 'itty-router';
import type { Request as IRequest } from 'itty-router';

import Search from './handlers/search';
import Trending from './handlers/trending';
import NotFound from './handlers/404';

import { movieRouter } from './routers/movie';
import { personRouter } from './routers/person';
import { tvRouter } from './routers/tv';
import { authRouter } from './routers/auth';

// Types
export type IttyRequest = IRequest & Request;

// Router
const router = Router({ base: '/api' });

router
  .get('/trending', Trending)
  .get('/search', Search)
  .all('/movie/*', movieRouter.handle)
  .all('/tv/*', tvRouter.handle)
  .all('/person/*', personRouter.handle)
  .all('/auth/*', authRouter.handle)
  .all('*', NotFound);

// Worker
addEventListener('fetch', (event) => event.respondWith(router.handle(event.request)));
