'use strict';

import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `

  scalar Date # imported from graphql-date, see resolvers

  type Query {
    plants: [Plant!]
    boards: [Board!]
    sensors: [Sensor!]
    #### See what you need.
  }

  type Plant {
    _id: String!
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
    _id: String!
    location: String!
    type: String
    isRemote: Boolean
    thumbnail: String
    sensors: [Sensor!]
  }

  # Analog and Digital sensors plugged into a microcontroller
  type Sensor {
    _id: String!
    type: String!
    board: Board!
    dataPin: Int!
    powerPin: Int
    data: [SensorData!]
  }

  interface SensorData {
    date: Date!
  }

  type AnalogSensorData implements SensorData {
    date: Date!
    reading: Int! # 0 to 1024 as a portion of input voltage.
  }

  type DHTSensorData implements SensorData {
    date: Date!
    temperature: Float! # degrees C
    humidity: Float! # percent
  }
`;

export default makeExecutableSchema({ typeDefs, resolvers });
