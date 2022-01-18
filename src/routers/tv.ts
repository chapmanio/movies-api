import { Router } from 'itty-router';

import { GetTv, GetTvCredits, TvSearch } from '../handlers/tv';

export const tvRouter = Router({ base: '/api/tv' });

tvRouter.get('/search', TvSearch).get('/:id', GetTv).get('/:id/credits', GetTvCredits);
