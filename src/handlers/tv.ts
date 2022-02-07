import type { IttyRequest } from '..';
import { buildResponse, fetchExternal } from '../utils/response';
import { theMovieDbApi } from '../utils/themoviedb';

export const TvSearch = (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');
  const { searchParams } = new URL(request.url);

  const apiUrl = theMovieDbApi(`/search/tv`, searchParams);

  return fetchExternal({ request: new Request(apiUrl), origin });
};

export const GetTv = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Get ID
  if (!request.params || request.params.id) {
    return buildResponse({
      body: 'TV ID param not supplied',
      origin,
      status: 422,
    });
  }

  // Call TMDB api and pass on query strings
  const { searchParams } = new URL(request.url);

  const apiUrl = theMovieDbApi(`/tv/${request.params.id}`, searchParams);

  return fetchExternal({ request: new Request(apiUrl), origin });
};

export const GetTvCredits = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');

  // Get ID
  if (!request.params || request.params.id) {
    return buildResponse({
      body: 'TV ID param not supplied',
      origin,
      status: 422,
    });
  }

  // Call TMDB api and pass on query strings
  const { searchParams } = new URL(request.url);

  const apiUrl = theMovieDbApi(`/tv/${request.params.id}/credits`, searchParams);

  return fetchExternal({ request: new Request(apiUrl), origin });
};
