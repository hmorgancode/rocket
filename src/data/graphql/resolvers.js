'use strict';

import mongoose from 'mongoose';
import Board from '../mongoose/Board';
import Plant from '../mongoose/Plant';
import AnalogSensor from '../mongoose/AnalogSensor';
import DHTSensor from '../mongoose/DHTSensor'
import GraphQLDate from 'graphql-date';
import Promise from 'bluebird';

// reminder:
// obj: result returned from the parent field's resolver
//       (or if top-level, the rootValue from server config)
// args: arguments passed into query
// context: state for this request. shared by all resolvers in a query.
// info: for advanced use, contains info about query's execution state.
//
// @TODO: make queries lean

const resolvers = {
  Query: {
    plants() {
      return Plant.find(); //@TODO have limits / look up graphql pagination best practice
    },
    boards() {
      return Board.find();
    },
    sensors() {
      return Promise.all([AnalogSensor.find(), DHTSensor.find()])
        .then((res) => res[0].concat(res[1]));
    },
    plant(obj, args) {
      if (args._id) {
        return Plant.findById(args._id);
      }
      return Plant.findOne({ ...args });
    },
    board(obj, args) {
      if (args._id) {
        return Board.findById(args._id);
      }
      return Board.findOne({ ...args });
    },
    sensor(obj, args) {
      if (args._id) {
        return Promise.all([AnalogSensor.findById({ ...args }), DHTSensor.findById({ ...args })])
          .then((res) => res[0] || res[1]);
      }
      return Promise.all([AnalogSensor.findOne({ ...args }), DHTSensor.findOne({ ...args })])
        .then((res) => res[0] || res[1]);
    }
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
    board(obj) {
      return Board.findById(obj.board);
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

  // findById?

  // scalars

  Date: GraphQLDate
};



export default resolvers;
