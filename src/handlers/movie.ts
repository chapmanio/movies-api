import type { Request } from 'itty-router';

import { theMovieDbApi } from '../utils/themoviedb';

export const MovieSearch = ({ url }: Request): Promise<Response> => {
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/search/movie`, searchParams);

  return fetch(apiUrl);
};

export const GetMovie = ({ url, params }: Request): Promise<Response> => {
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/movie/${params}`, searchParams);

  return fetch(apiUrl);
};

export const GetMovieCredits = ({ url, params }: Request): Promise<Response> => {
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/movie/${params}/credits`, searchParams);

  return fetch(apiUrl);
};
