import type { IttyRequest } from '..';
import { theMovieDbApi } from '../utils/themoviedb';

export const MovieSearch = ({ url }: IttyRequest): Promise<Response> => {
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/search/movie`, searchParams);

  return fetch(apiUrl);
};

export const GetMovie = ({ url, params }: IttyRequest): Promise<Response> => {
  // Get ID
  const id = params ? params.id : undefined;

  // Call TMDB api and pass on query strings
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/movie/${id}`, searchParams);

  return fetch(apiUrl);
};

export const GetMovieCredits = ({ url, params }: IttyRequest): Promise<Response> => {
  // Get ID
  const id = params ? params.id : undefined;

  // Call TMDB api and pass on query strings
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/movie/${id}/credits`, searchParams);

  return fetch(apiUrl);
};
