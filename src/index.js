'use strict';
import koa from 'koa';
import koaHelmet from 'koa-helmet';
import koaRouter from 'koa-router';
import koaBodyParser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import cors from 'kcors';
import { graphqlKoa, graphiqlKoa  } from 'apollo-server-koa';
import schema from './data/graphql/schema';
import { connectToDatabase } from './modules/databaseConnection';
import imageUpload from './modules/imageUpload';
import imageDelete from './modules/imageDelete';

// Quick check to confirm that we've loaded .env
if (!process.env.PROD_DB_URI) {
  throw new Error('Environment variables not loaded.');
}
connectToDatabase(process.env.PROD_DB_URI);

const app = new koa();
const router = new koaRouter();

// set various more secure http headers
app.use(koaHelmet());

if (process.env.NODE_ENV === 'test') {
  // enable cors (all origins/methods)
  app.use(cors());
}
// serve public directory
app.use(koaStatic(process.env.APP_ROOT + process.env.PUBLIC_DIR));

// apollo client only uses post. See apollo-client issue #813 for context.
router.post('/graphql', koaBodyParser(), graphqlKoa({ schema }));

if (process.env.NODE_ENV === 'test') {
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));
}

// Small REST API for image uploads and deletions
router.post('/image_upload', imageUpload());
router.post('/image_delete', imageDelete());

// router.use('/', async (ctx, next) => {
//   ctx.body = 'You are messing around with koa stuff and should remove this. (404 is koa\'s default response status)';
//   await next(); // not needed anymore? mess around more w/ koa routes
// });

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(process.env.PORT);

// export default app; // for tests?
