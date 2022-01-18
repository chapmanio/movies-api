export const theMovieDbApi = (url: string, params?: URLSearchParams): string => {
  if (!MOVIE_API_KEY || MOVIE_API_KEY.trim() === '') {
    throw new Error('The Movie DB api key missing');
  }

  if (url.trim() === '') {
    throw new Error('The Movie DB api url missing');
  }

  // Make sure the url starts with a /
  const apiUrl = url.startsWith('/') ? url : `/${url}`;

  // Add API key to search params
  const combinedParams = params ? params : new URLSearchParams();

  combinedParams.set('api_key', MOVIE_API_KEY);

  return `https://api.themoviedb.org/3${apiUrl}?${combinedParams.toString()}`;
};
