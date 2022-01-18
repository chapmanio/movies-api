import { Router } from 'itty-router';

import { GetMovie, GetMovieCredits, MovieSearch } from '../handlers/movie';

export const movieRouter = Router({ base: '/api/movie' });

movieRouter.get('/search', MovieSearch).get('/:id', GetMovie).get('/:id/credits', GetMovieCredits);
