'use strict';

const resolvers = {
  Query: {
    // obj, {arg1, arg2, ...}, context, info
    testString(obj, args) {
      return 'Test string!';
    },
    author(obj, args) {
      return { id: 1, firstName: 'Hello', lastName: 'World' };
    }
  }
};

export default resolvers;
