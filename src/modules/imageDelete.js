// Module for a REST endpoint that accepts an image name and deletes it
'use strict';
import compose from 'koa-compose';
import koaBodyParser from 'koa-bodyparser';
import { promisify } from 'util';
const unlink = promisify(require('fs').unlink);

const uploadsDir = process.env.APP_ROOT + process.env.PUBLIC_DIR + '/uploads';
export default function imageDelete() {
  async function deleteImage(ctx, next) {
    try {
      await unlink(`${uploadsDir}/${ctx.request.body.imageName}`);
      ctx.response.status = 200;
    } catch (err) {
      ctx.throw('File does not exist.');
    }
    await next();
  }

  return compose([koaBodyParser(), deleteImage]);
}
