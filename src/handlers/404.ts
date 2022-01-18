const NotFound = (): Response => {
  return new Response('404, not found!', {
    status: 404,
  });
};

export default NotFound;
