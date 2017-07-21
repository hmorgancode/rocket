'use strict';

import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
  type Query {
    testString: String,
    author: Author
  },

  type Author {
    id: Int!,
    firstName: String,
    lastName: String,
  }
`;

export default makeExecutableSchema({ typeDefs, resolvers });
