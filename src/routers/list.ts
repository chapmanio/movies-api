import { Router } from 'itty-router';

import { AddList, DeleteList, GetAllLists, GetList, UpdateList } from '../handlers/list';

export const listRouter = Router({ base: '/api/list' });

listRouter
  .get('/', GetAllLists)
  .get('/:slug', GetList)
  .post('/', AddList)
  .post('/:slug', UpdateList)
  .post('/delete/:slug', DeleteList);
