import { fetchExternal } from '../utils/response';
import { theMovieDbApi } from '../utils/themoviedb';

const Trending = async (request: Request): Promise<Response> => {
  const origin = request.headers.get('origin');
  const apiUrl = theMovieDbApi(`/trending/all/day`);

  return fetchExternal({ request: new Request(apiUrl), origin });
};

export default Trending;
