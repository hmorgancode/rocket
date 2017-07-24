'use strict';

import koa from 'koa';
import koaHelmet from 'koa-helmet';
import koaRouter from 'koa-router';
import koaBodyParser from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa  } from 'apollo-server-koa';
import schema from './data/graphql/schema';
import { connectToDatabase } from './modules/databaseConnection';

require('dotenv').config();
connectToDatabase(process.env.TEST_DB_URI);

const app = new koa();
const router = new koaRouter();
const PORT = 3000;

app.use(koaHelmet());

// apollo client only uses post. See apollo-client issue #813 for context.
router.post('/graphql', koaBodyParser(), graphqlKoa({ schema }));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

router.use('/', async (ctx, next) => {
  ctx.body = 'You are messing around with koa stuff and should remove this. (404 is koa\'s default response status)';
  await next(); // not needed anymore? mess around more w/ koa routes
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);

export default app; // for tests?
