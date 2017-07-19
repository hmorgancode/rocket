'use strict';

const graphQLTools = require('graphql-tools');
const makeExecutableSchema = graphQLTools.makeExecutableSchema;
// const addMockFunctionsToSchema = graphQLTools.addMockFunctionsToSchema;
const resolvers = require('./resolvers');

// const mocks = require('./mocks');

const typeDefs = `
type Query {
  testString: String
}
`;

// const schema = makeExecutableSchema({typedefs});
// addMockFunctionsToSchema({schema, mocks});

export default makeExecutableSchema({ typeDefs, resolvers });
