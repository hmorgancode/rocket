'use strict';

import GraphQLDate from 'graphql-date';

const resolvers = {
  Query: {
    // obj, {arg1, arg2, ...}, context, info
    // testString(obj, args) {
    //   return 'Test string!';
    // },
    // author(obj, args) {
    //   return { id: 1, firstName: 'Hello', lastName: 'World' };
    // }
  },

  Sensor: {
    __resolveType(obj, context, info) {
      if (obj.type.indexOf('DHT') > -1) { // @OPT this using context if it ever becomes an issue
        return 'DHTSensor';
      }
      return 'AnalogSensor';
    }
  },

  SensorData: {
    __resolveType(obj, context, info) {
      if (obj.humidity != null) {
        return 'DHTSensorData';
      }
      return 'AnalogSensorData';
    }
  },

  Date: GraphQLDate
};

export default resolvers;
