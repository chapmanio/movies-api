import type { IttyRequest } from '..';
import { theMovieDbApi } from '../utils/themoviedb';

export const PersonSearch = ({ url }: IttyRequest): Promise<Response> => {
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/search/person`, searchParams);

  return fetch(apiUrl);
};

export const GetPerson = ({ url, params }: IttyRequest): Promise<Response> => {
  // Get ID
  const id = params ? params.id : undefined;

  // Call TMDB api and pass on query strings
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/person/${id}`, searchParams);

  return fetch(apiUrl);
};

export const GetPersonCredits = ({ url, params }: IttyRequest): Promise<Response> => {
  // Get ID
  const id = params ? params.id : undefined;

  // Call TMDB api and pass on query strings
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/person/${id}/combined_credits`, searchParams);

  return fetch(apiUrl);
};
