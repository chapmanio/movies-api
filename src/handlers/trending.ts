import { theMovieDbApi } from '../utils/themoviedb';

const Trending = async (): Promise<Response> => {
  const apiUrl = theMovieDbApi(`/trending/all/day`);

  return fetch(apiUrl);
};

export default Trending;
