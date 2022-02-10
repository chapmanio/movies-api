import { Router } from 'itty-router';

import { AddListItem, DeleteListItem } from '../handlers/listItem';

export const listItemRouter = Router({ base: '/api/list-item' });

listItemRouter.post('/:listId', AddListItem).post('/:listId/delete/:id', DeleteListItem);
