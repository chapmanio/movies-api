import { Router } from 'itty-router';

import { GetListItem, AddListItem, DeleteListItem } from '../handlers/listItem';

export const listItemRouter = Router({ base: '/api/list-item' });

listItemRouter
  .get('/:listSlug/:id', GetListItem)
  .post('/:listSlug', AddListItem)
  .post('/:listSlug/delete/:id', DeleteListItem);
