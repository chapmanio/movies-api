import type { IttyRequest } from '..';
import { buildResponse, fetchExternal } from '../utils/response';
import { theMovieDbApi } from '../utils/themoviedb';

export const PersonSearch = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');
  const { searchParams } = new URL(request.url);

  const apiUrl = theMovieDbApi(`/search/person`, searchParams);

  return fetchExternal({ request: new Request(apiUrl), origin });
};

export const GetPerson = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Get ID
  if (!request.params?.id) {
    return buildResponse({
      body: 'Person ID param not supplied',
      origin,
      status: 422,
    });
  }

  // Call TMDB api and pass on query strings
  const { searchParams } = new URL(request.url);

  const apiUrl = theMovieDbApi(`/person/${request.params.id}`, searchParams);

  return fetchExternal({ request: new Request(apiUrl), origin });
};

export const GetPersonCredits = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Get ID
  if (!request.params?.id) {
    return buildResponse({
      body: 'Person ID param not supplied',
      origin,
      status: 422,
    });
  }

  // Call TMDB api and pass on query strings
  const { searchParams } = new URL(request.url);

  const apiUrl = theMovieDbApi(`/person/${request.params.id}/combined_credits`, searchParams);

  return fetchExternal({ request: new Request(apiUrl), origin });
};
