'use strict';

import mongoose from 'mongoose';
import Board from '../mongoose/Board';
import Plant from '../mongoose/Plant';
import Sensor from '../mongoose/Sensor';
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
      return Plant.find().lean(); //@TODO have limits / look up graphql pagination best practice
    },
    boards() {
      return Board.find().lean();
    },
    sensors() {
      return Sensor.find().lean();
    },
    plant(obj, args) {
      if (args._id) {
        return Plant.findById(args._id).lean();
      }
      return Plant.findOne({ ...args }).lean();
    },
    board(obj, args) {
      if (args._id) {
        return Board.findById(args._id).lean();
      }
      return Board.findOne({ ...args }).lean();
    },
    sensor(obj, args) {
      if (args._id) {
        return Sensor.findById({ ...args }).lean();
      }
      return Sensor.findOne({ ...args }).lean();
    }
  },

  Plant: {
    board(obj) {
      return Board.findById(obj.board).lean();
    },
    sensors(obj) {
      return Sensor.find().where('_id').in(obj.sensors).lean();
    }
  },

  Board: {
    sensors(obj) {
      return Sensor.find().where('_id').in(obj.sensors).lean();
    }
  },

  Sensor: {
    board(obj) {
      return Board.findById(obj.board).lean();
    },
  },

  // findById?

  // scalars
  Date: GraphQLDate,

  // Mutations
  Mutation: {
    createPlant(obj, args) {
      return Plant.create({ ...args });
    },

    updatePlant(obj, args) {
      // {new: true} is to return the modified plant (not the original)
      return Plant.findByIdAndUpdate(args._id, { ...args }, { new: true }).lean();
    },

    deletePlant(obj, args) {
      return Plant.findByIdAndRemove(args._id).lean();
    },

    createBoard(obj, args) {
      return Board.create({ ...args });
    },

    updateBoard(obj, args) {
      return Board.findByIdAndUpdate(args._id, { ...args }, { new: true }).lean();
    },

    deleteBoard(obj, args) {
      return Board.findByIdAndRemove(args._id).lean();
    },

    createSensor(obj, args) {
      return Sensor.create({ ...args });
    },

    updateSensor(obj, args) {
      return Sensor.findByIdAndUpdate(args._id, { ...args }, { new: true }).lean();
    },

    deleteSensor(obj, args) {
      return Sensor.findByIdAndRemove(args._id).lean();
    },

    createSensorData(obj, args) {

    },

    deleteSensorData(obj, args) {

    }

  }
};



export default resolvers;
