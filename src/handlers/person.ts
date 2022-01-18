import type { Request } from 'itty-router';

import { theMovieDbApi } from '../utils/themoviedb';

export const PersonSearch = ({ url }: Request): Promise<Response> => {
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/search/person`, searchParams);

  return fetch(apiUrl);
};

export const GetPerson = ({ url, params }: Request): Promise<Response> => {
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/person/${params}`, searchParams);

  return fetch(apiUrl);
};

export const GetPersonCredits = ({ url, params }: Request): Promise<Response> => {
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/person/${params}/combined_credits`, searchParams);

  return fetch(apiUrl);
};
