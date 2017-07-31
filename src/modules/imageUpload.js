// Module for a REST endpoint that accepts an image and returns the URL on the server.
// Pretty barebones for now.
'use strict';
import multer from 'koa-multer';
import compose from 'koa-compose';
import path from 'path';
import sanitize from 'sanitize-filename';

const storage = multer.diskStorage({
  destination: process.env.APP_ROOT + process.env.PUBLIC_DIR + '/uploads',
  filename(req, file, cb) {
    // Turning all spaces to _ is a personal preference here- sanitize
    // does that, but only on windows (where it would be an invalid filename).
    cb(null, sanitize(`${new Date()}-${file.originalname}`.replace(/ /g, '')));
  }
});

const parseAndSave = multer({
  storage,
  // multer is an express library. We're using an adapter, but functions submitted to
  // it still require an express signature.
  fileFilter: function (req, file, cb) {
    if (!['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file.originalname))) {
      return cb(new Error('Submitted file must be an image.'));
    }
    cb(null, true);
  }
}).single('thumbnail');

export default function imageUpload() {
  async function respondWithFilename(ctx, next) {
    ctx.response.body = ctx.req.file.filename;
    await next();
  };

  return compose([parseAndSave, respondWithFilename]);
}

