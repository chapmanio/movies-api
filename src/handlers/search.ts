import type { IttyRequest } from '..';
import { theMovieDbApi } from '../utils/themoviedb';

const Search = ({ url }: IttyRequest): Promise<Response> => {
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/search/multi`, searchParams);

  return fetch(apiUrl);
};

export default Search;
