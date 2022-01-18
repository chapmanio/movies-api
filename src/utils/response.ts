export const jsonResponse = (data: unknown): Response => {
  const json = JSON.stringify(data);

  return new Response(json, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
};
