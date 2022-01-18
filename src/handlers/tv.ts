import type { Request } from 'itty-router';

import { theMovieDbApi } from '../utils/themoviedb';

export const TvSearch = ({ url }: Request): Promise<Response> => {
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/search/tv`, searchParams);

  return fetch(apiUrl);
};

export const GetTv = ({ url, params }: Request): Promise<Response> => {
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/tv/${params}`, searchParams);

  return fetch(apiUrl);
};

export const GetTvCredits = ({ url, params }: Request): Promise<Response> => {
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/tv/${params}/credits`, searchParams);

  return fetch(apiUrl);
};
