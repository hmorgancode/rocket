'use strict';

import mongoose from 'mongoose';
import Board from '../mongoose/Board';
import Plant from '../mongoose/Plant';
import AnalogSensor from '../mongoose/AnalogSensor';
import DHTSensor from '../mongoose/DHTSensor'
import GraphQLDate from 'graphql-date';
import Promise from 'bluebird';

// import and use Mongoose models
// figure out what methods you need to add to your mongoose models from this (if anything)

const resolvers = {
  Query: {
    plants(obj, args, context) {
      return Plant.find();
    },
    boards(obj, args, context) {
      return Board.find();
    },
    sensors(obj, args, context) {
      return Promise.all([AnalogSensor.find(), DHTSensor.find()])
        .then((res) => res[0].concat(res[1]));
    }

    // obj: result returned from the parent field's resolver
    //       (or if top-level, the rootValue from server config)
    // args: arguments passed into query
    // context: state for this request. shared by all resolvers in a query.
    // info: for advanced use, contains info about query's execution state.

    // obj, {arg1, arg2, ...}, context, info
    // testString(obj, args) {
    //   return 'Test string!';
    // },
    // author(obj, args) {
    //   return { id: 1, firstName: 'Hello', lastName: 'World' };
    // }
  },

  Plant: {
    board(obj) {
      return Board.findById(obj.board);
    },
    sensors(obj) {
      return Promise.all([AnalogSensor.find().where('_id').in(obj.sensors),
                          DHTSensor.find().where('_id').in(obj.sensors)])
        .then((res) => res[0].concat(res[1]));
    }
  },

  Board: {
    sensors(obj) {
      return Promise.all([AnalogSensor.find().where('_id').in(obj.sensors),
                          DHTSensor.find().where('_id').in(obj.sensors)])
        .then((res) => res[0].concat(res[1]));
    }
  },

  Sensor: {
    __resolveType(obj, context, info) {
      if (obj.type.indexOf('DHT') > -1) { // @OPT this using context if it ever becomes an issue
        return 'DHTSensor';
      }
      return 'AnalogSensor';
    },

  },

  SensorData: {
    __resolveType(obj, context, info) {
      if (obj.humidity != null) {
        return 'DHTSensorData';
      }
      return 'AnalogSensorData';
    }
  },

  AnalogSensor: {

  },

  AnalogSensorData: {

  },

  DHTSensor: {

  },

  DHTSensorData: {

  },

  // findById?

  // scalars

  Date: GraphQLDate
};



export default resolvers;
