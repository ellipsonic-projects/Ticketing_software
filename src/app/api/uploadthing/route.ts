import { createRouteHandler } from 'uploadthing/next';
import fs from 'fs';
import path from 'path';

import { uploadRouter } from './core';

const handlers = createRouteHandler({
  router: uploadRouter,
});

export const GET = handlers.GET;

export const POST = async (req: any, ctx: any) => {
  try {
    const res = await handlers.POST(req, ctx);
    if (!res.ok) {
      const text = await res.text();
      fs.appendFileSync(
        path.join(process.cwd(), 'uploadthing-error.log'),
        `[${new Date().toISOString()}] UploadThing POST Error: Status ${res.status} - ${text}\n`
      );
      // Return a new response because the stream was consumed
      return new Response(text, { status: res.status, headers: res.headers });
    }
    return res;
  } catch (err: any) {
    fs.appendFileSync(
      path.join(process.cwd(), 'uploadthing-error.log'),
      `[${new Date().toISOString()}] UploadThing POST Exception: ${err.stack || err.message}\n`
    );
    throw err;
  }
};
