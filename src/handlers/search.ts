import type { Request } from 'itty-router';

import { theMovieDbApi } from '../utils/themoviedb';

const Search = ({ url }: Request): Promise<Response> => {
  const { searchParams } = new URL(url);

  const apiUrl = theMovieDbApi(`/search/multi`, searchParams);

  return fetch(apiUrl);
};

export default Search;
