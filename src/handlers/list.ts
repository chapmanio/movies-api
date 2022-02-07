import slugify from 'slugify';
import { PrismaClient } from '@prisma/client';

import type { IttyRequest } from '..';
import { buildErrorResponse, buildResponse } from '../utils/response';
import { verifyCookie } from '../utils/auth';

// Types
type ListParams = {
  name: string;
};

// Handlers
export const GetAllLists = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  try {
    // Get all lists
    const db = new PrismaClient();

    const lists = await db.list.findMany({
      orderBy: [{ name: 'asc' }],
    });

    return buildResponse({
      body: lists,
      origin,
    });
  } catch (error) {
    return buildErrorResponse({ error, origin, status: 502 });
  }
};

export const GetList = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Validate params
  if (!request.params || request.params.slug) {
    return buildResponse({
      body: 'List slug param not supplied',
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

    // Get single list
    const db = new PrismaClient();

    const list = await db.list.findUnique({
      where: {
        slug: request.params.slug,
      },
    });

    if (!list) {
      return buildResponse({
        body: `No list found with slug: ${request.params.slug}`,
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

    return buildResponse({
      body: list,
      origin,
    });
  } catch (error) {
    return buildErrorResponse({ error, origin, status: 502 });
  }
};

export const AddList = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Get request body
  // TODO: Use zod?
  let requestBody: ListParams | undefined;

  try {
    requestBody = await request.json<ListParams>();
  } catch (error) {
    return buildResponse({
      body: 'Expected JSON not supplied',
      origin,
      status: 422,
    });
  }

  const { name } = requestBody;

  if (!name) {
    return buildResponse({
      body: 'Name not supplied',
      origin,
      status: 422,
    });
  }

  // Check access
  const cookiePayload = verifyCookie(request.headers.get('Cookie'));

  if (!cookiePayload) {
    return buildResponse({
      body: 'You must be signed in to add a new list',
      origin,
      status: 401,
    });
  }

  try {
    // Create the list
    const { name } = requestBody;
    const { userId } = cookiePayload;

    const db = new PrismaClient();

    const list = await db.list.create({
      data: {
        name,
        slug: slugify(name, { lower: true }),
        userId,
      },
    });

    return buildResponse({
      body: list,
      origin,
    });
  } catch (error) {
    return buildErrorResponse({ error, origin });
  }
};

export const UpdateList = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Validate params
  if (!request.params || request.params.slug) {
    return buildResponse({
      body: 'Slug param not supplied',
      origin,
      status: 422,
    });
  }

  // TODO: Use zod?
  let requestBody: ListParams | undefined;

  try {
    requestBody = await request.json<ListParams>();
  } catch (error) {
    return buildResponse({
      body: 'Expected JSON not supplied',
      origin,
      status: 422,
    });
  }

  const { name } = requestBody;

  if (!name) {
    return buildResponse({
      body: 'Name not supplied',
      origin,
      status: 422,
    });
  }

  // Check access
  const cookiePayload = verifyCookie(request.headers.get('Cookie'));

  if (!cookiePayload) {
    return buildResponse({
      body: 'You must be signed in to update a list',
      origin,
      status: 401,
    });
  }

  try {
    const db = new PrismaClient();

    const { name } = requestBody;
    const { userId } = cookiePayload;

    // Find the current list
    const currentList = await db.list.findUnique({
      where: {
        slug: request.params.slug,
      },
    });

    if (!currentList) {
      return buildResponse({
        body: 'List not found',
        origin,
        status: 404,
      });
    }

    // Check if the user owns the list
    if (currentList.userId !== userId) {
      return buildResponse({
        body: 'You may only update your own lists',
        origin,
        status: 403,
      });
    }

    // Update the list
    const updatedList = await db.list.update({
      data: {
        name,
        slug: slugify(name, { lower: true }),
      },
      where: {
        slug: request.params.slug,
      },
    });

    return buildResponse({
      body: updatedList,
      origin,
    });
  } catch (error) {
    return buildErrorResponse({ error, origin });
  }
};

export const DeleteList = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Validate params
  if (!request.params || request.params.slug) {
    return buildResponse({
      body: 'Slug param not supplied',
      origin,
      status: 422,
    });
  }

  // Check access
  const cookiePayload = verifyCookie(request.headers.get('Cookie'));

  if (!cookiePayload) {
    return buildResponse({
      body: 'You must be signed in to remove a list',
      origin,
      status: 401,
    });
  }

  try {
    const db = new PrismaClient();

    const { userId } = cookiePayload;

    // Find the current list
    const currentList = await db.list.findUnique({
      where: {
        slug: request.params.slug,
      },
    });

    if (!currentList) {
      return buildResponse({
        body: 'List not found',
        origin,
        status: 404,
      });
    }

    // Check if the user owns the list
    if (currentList.userId !== userId) {
      return buildResponse({
        body: 'You may only remove your own lists',
        origin,
        status: 403,
      });
    }

    // Update the list
    await db.list.delete({
      where: {
        slug: request.params.slug,
      },
    });

    return buildResponse({
      body: 'List removed',
      origin,
    });
  } catch (error) {
    return buildErrorResponse({ error, origin });
  }
};
