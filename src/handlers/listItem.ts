import { MediaType, PrismaClient } from '@prisma/client';

import type { IttyRequest } from '..';
import { buildErrorResponse, buildResponse } from '../utils/response';
import { verifyCookie } from '../utils/auth';

// Types
type ListItemParams = {
  mediaType: MediaType;
  tmdbId: number;
  title: string;
  subtitle?: string;
  posterUrl?: string;
};

// Handlers
export const GetListItem = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Validate params
  if (!request.params || !request.params.listSlug || !request.params.id) {
    return buildResponse({
      body: 'List ID params not supplied',
      origin,
      status: 422,
    });
  }

  // Check access
  const cookiePayload = verifyCookie(request.headers.get('Cookie'));

  if (!cookiePayload) {
    return buildResponse({
      body: 'You must be signed in to view a new list',
      origin,
      status: 401,
    });
  }

  try {
    const { userId } = cookiePayload;

    // Get list
    const db = new PrismaClient();

    const list = await db.list.findUnique({
      where: {
        slug: request.params.slug,
      },
      include: {
        items: { orderBy: [{ title: 'asc' }] },
      },
    });

    if (!list) {
      return buildResponse({
        body: `List not found`,
        origin,
        status: 404,
      });
    }

    // Check if the user owns the list
    if (list.userId !== userId) {
      return buildResponse({
        body: 'You may only view your own lists',
        origin,
        status: 403,
      });
    }

    // Get list item
    const listItem = await db.listItem.findUnique({
      where: {
        id: request.params.id,
      },
    });

    if (!listItem) {
      return buildResponse({
        body: `List item not found`,
        origin,
        status: 404,
      });
    }

    return buildResponse({
      body: listItem,
      origin,
    });
  } catch (error) {
    return buildErrorResponse({ error, origin, status: 502 });
  }
};

export const AddListItem = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Validate params
  if (!request.params || !request.params.listSlug) {
    return buildResponse({
      body: 'List slug param not supplied',
      origin,
      status: 422,
    });
  }

  // Get request body
  // TODO: Use zod?
  let requestBody: ListItemParams | undefined;

  try {
    requestBody = await request.json<ListItemParams>();
  } catch (error) {
    return buildResponse({
      body: 'Expected JSON not supplied',
      origin,
      status: 422,
    });
  }

  const { mediaType, tmdbId, title, subtitle, posterUrl } = requestBody;

  if (!mediaType || !tmdbId || !title) {
    return buildResponse({
      body: 'Media Type, TMBD ID or item title not supplied',
      origin,
      status: 422,
    });
  }

  // Check access
  const cookiePayload = verifyCookie(request.headers.get('Cookie'));

  if (!cookiePayload) {
    return buildResponse({
      body: 'You must be signed in to add an item to a list',
      origin,
      status: 401,
    });
  }

  try {
    const { userId } = cookiePayload;

    // Get the list
    const db = new PrismaClient();

    const list = await db.list.findUnique({
      where: {
        slug: request.params.listSlug,
      },
    });

    if (!list) {
      return buildResponse({
        body: `List not found`,
        origin,
        status: 404,
      });
    }

    // Check if the user owns the list
    if (list.userId !== userId) {
      return buildResponse({
        body: 'You may only add items to your own lists',
        origin,
        status: 403,
      });
    }

    // Add the list item
    const listItem = await db.listItem.create({
      data: {
        listId: request.params.listId,
        mediaType,
        tmdbId,
        title,
        subtitle,
        posterUrl,
      },
    });

    return buildResponse({
      body: listItem,
      origin,
    });
  } catch (error) {
    return buildErrorResponse({ error, origin });
  }
};

export const DeleteListItem = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Validate params
  if (!request.params || !request.params.listSlug || !request.params.id) {
    return buildResponse({
      body: 'List ID params not supplied',
      origin,
      status: 422,
    });
  }

  // Check access
  const cookiePayload = verifyCookie(request.headers.get('Cookie'));

  if (!cookiePayload) {
    return buildResponse({
      body: 'You must be signed in to remove an item to a list',
      origin,
      status: 401,
    });
  }

  try {
    const { userId } = cookiePayload;

    // Get the list
    const db = new PrismaClient();

    const list = await db.list.findUnique({
      where: {
        slug: request.params.listSlug,
      },
    });

    if (!list) {
      return buildResponse({
        body: `List not found`,
        origin,
        status: 404,
      });
    }

    // Check if the user owns the list
    if (list.userId !== userId) {
      return buildResponse({
        body: 'You may only remove items to your own lists',
        origin,
        status: 403,
      });
    }

    // Remove the list item
    await db.listItem.delete({
      where: {
        id: request.params.id,
      },
    });

    return buildResponse({
      body: 'List item removed',
      origin,
    });
  } catch (error) {
    return buildErrorResponse({ error, origin });
  }
};
