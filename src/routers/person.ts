import { Router } from 'itty-router';

import { GetPerson, GetPersonCredits, PersonSearch } from '../handlers/person';

export const personRouter = Router({ base: '/api/person' });

personRouter
  .get('/search', PersonSearch)
  .get('/:id', GetPerson)
  .get('/:id/credits', GetPersonCredits);
