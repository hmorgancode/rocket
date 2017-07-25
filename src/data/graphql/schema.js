'use strict';

import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `

  scalar Date # imported from graphql-date, see resolvers

  type Query {
    plants: [Plant]
    boards: [Board]
    sensors: [Sensor]
    plant: Plant
    board: Board
    sensor: Sensor
    #### See what else you need.
  }

  type Plant {
    _id: ID!
    name: String!
    altName: String
    thumbnail: String!
    tags: [String!]
    notes: String
    board: Board!
    sensors: [Sensor!]
  }

  # Microcontroller - Currently Arduino mega/uno/nano
  type Board {
    _id: ID!
    location: String!
    type: String
    isRemote: Boolean
    thumbnail: String
    sensors: [Sensor!]
  }

  # Analog and Digital sensors plugged into a microcontroller
  type Sensor {
    _id: ID!
    type: String!
    board: Board!
    dataPin: Int!
    powerPin: Int
    data: [SensorData!]
  }

  type SensorData {
    date: Date!
    reading: Int # 0 to 1024 as a portion of input voltage
    temperature: Float # degrees C
    humidity: Float # percent
  }

  input SensorInput {
    reading: Int
    temperature: Float
    humidity: Float
  }

  type Mutation {
    createPlant (
      name: String!
      thumbnail: String!
      board: ID!
      altName: String
      tags: [String!]
      notes: String
      sensors: [ID!]
    ): Plant

    updatePlant (
      _id: ID!
      name: String
      thumbnail: String
      board: ID
      altName: String
      tags: [String!]
      notes: String
      sensors: [ID!]
    ): Plant

    deletePlant (
      _id: ID!
    ): Plant

    createBoard (
      location: String!
      type: String
      isRemote: Boolean
      thumbnail: String
      sensors: [ID!]
    ): Board

    updateBoard (
      _id: ID!
      location: String
      type: String
      isRemote: Boolean
      thumbnail: String
      sensors: [ID!]
    ): Board

    deleteBoard (
      _id: ID!
    ): Board

    createSensor (
      type: String!
      board: ID!
      dataPin: Int!
      powerPin: Int
    ): Sensor

    updateSensor (
      _id: ID!
      type: String
      board: ID
      dataPin: Int
      powerPin: Int
    ): Sensor

    deleteSensor (
      _id: ID!
    ): Sensor

    # context: boards send sensor data but aren't aware of IDs.
    # so, on the server, derive sensor from board location & sensor datapin
    createSensorData (
      location: String!
      dataPin: Int!
      data: SensorInput!
    ): Sensor

    deleteSensorData (
      _id: ID!
      from: Date
      to: Date
    ): [SensorData!]
  }

  # since we've added mutations, we need to tell the server which types represent
  # the root query and root mutation types
  schema {
    query: Query
    mutation: Mutation
  }
`;

export default makeExecutableSchema({ typeDefs, resolvers });
