import type { IttyRequest } from '..';
import { fetchExternal } from '../utils/response';
import { theMovieDbApi } from '../utils/themoviedb';

const Search = async (request: IttyRequest): Promise<Response> => {
  const origin = request.headers.get('origin');
  const { searchParams } = new URL(request.url);

  const apiUrl = theMovieDbApi(`/search/multi`, searchParams);

  return fetchExternal({ request: new Request(apiUrl), origin });
};

export default Search;
