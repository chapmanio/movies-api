import type { IttyRequest } from '..';
import { theMovieDbApi } from '../utils/themoviedb';

export const TvSearch = ({ url }: IttyRequest): Promise<Response> => {
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/search/tv`, searchParams);

  return fetch(apiUrl);
};

export const GetTv = ({ url, params }: IttyRequest): Promise<Response> => {
  // Get ID
  const id = params ? params.id : undefined;

  // Call TMDB api and pass on query strings
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/tv/${id}`, searchParams);

  return fetch(apiUrl);
};

export const GetTvCredits = ({ url, params }: IttyRequest): Promise<Response> => {
  // Get ID
  const id = params ? params.id : undefined;

  // Call TMDB api and pass on query strings
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/tv/${id}/credits`, searchParams);

  return fetch(apiUrl);
};
