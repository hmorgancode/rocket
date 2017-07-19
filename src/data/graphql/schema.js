'use strict';

import makeExecutableSchema from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
  type Query {
    testString: String
  }
`;

export default makeExecutableSchema({ typeDefs, resolvers });
