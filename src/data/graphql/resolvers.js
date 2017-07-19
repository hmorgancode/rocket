'use strict';

const resolvers = {
  Query: {
    author(root, args) {
      return { id: 1, firstName: 'Hello', lastName: 'World' };
    }
  }
};

export default resolvers;
