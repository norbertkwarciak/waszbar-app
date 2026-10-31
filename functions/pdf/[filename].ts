const PDF_ORIGIN = 'https://assets.waszbar.app/pdf';

const getFilename = (param: string | string[] | undefined): string | null => {
  if (typeof param !== 'string' || !/^[a-zA-Z0-9._-]+\.pdf$/i.test(param)) {
    return null;
  }

  return param;
};

export const onRequest: PagesFunction = async ({ params, request }) => {
  const filename = getFilename(params.filename);
  if (!filename) {
    return new Response('Not found', { status: 404 });
  }

  const upstreamHeaders = new Headers();
  const range = request.headers.get('Range');
  const ifRange = request.headers.get('If-Range');
  if (range) upstreamHeaders.set('Range', range);
  if (ifRange) upstreamHeaders.set('If-Range', ifRange);

  const upstream = await fetch(`${PDF_ORIGIN}/${encodeURIComponent(filename)}`, {
    method: request.method === 'HEAD' ? 'HEAD' : 'GET',
    headers: upstreamHeaders,
  });

  const headers = new Headers();
  for (const name of [
    'Accept-Ranges',
    'Content-Length',
    'Content-Range',
    'ETag',
    'Last-Modified',
  ]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }

  headers.set('Content-Type', 'application/pdf');
  headers.set('Content-Disposition', `inline; filename="${filename}"`);
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  headers.set('X-Content-Type-Options', 'nosniff');

  return new Response(request.method === 'HEAD' ? null : upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
};
