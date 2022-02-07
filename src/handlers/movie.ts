import type { IttyRequest } from '..';
import { buildResponse, fetchExternal } from '../utils/response';
import { theMovieDbApi } from '../utils/themoviedb';

export const MovieSearch = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');
  const { searchParams } = new URL(request.url);

  const apiUrl = theMovieDbApi(`/search/movie`, searchParams);

  return fetchExternal({ request: new Request(apiUrl), origin });
};

export const GetMovie = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Get ID
  if (!request.params || request.params.id) {
    return buildResponse({
      body: 'Movie ID param not supplied',
      origin,
      status: 422,
    });
  }

  // Call TMDB api and pass on query strings
  const { searchParams } = new URL(request.url);

  const apiUrl = theMovieDbApi(`/movie/${request.params.id}`, searchParams);

  return fetchExternal({ request: new Request(apiUrl), origin });
};

export const GetMovieCredits = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Get ID
  if (!request.params || request.params.id) {
    return buildResponse({
      body: 'Movie ID param not supplied',
      origin,
      status: 422,
    });
  }

  // Call TMDB api and pass on query strings
  const { searchParams } = new URL(request.url);

  const apiUrl = theMovieDbApi(`/movie/${request.params.id}/credits`, searchParams);

  return fetchExternal({ request: new Request(apiUrl), origin });
};
