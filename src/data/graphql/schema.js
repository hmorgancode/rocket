'use strict';

import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
  type Query {
    plants: [Plant!]!
    boards: [Board!]!
    sensors: [Sensor!]!
    #### See what you need.
  }

  type Plant {
    id: String!
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
    id: String!
    location: String!
    type: String
    isRemote: Boolean
    thumbnail: String
    sensors: [Sensor!]
  }

  # Analog and Digital sensors plugged into a microcontroller
  interface Sensor {
    id: String!
    type: String!
    board: Board!
    dataPin: Int!
    powerPin: Int
    data: [SensorData!]
  }

  interface SensorData {
    date: Date!
  }

  # Analog Sensor - Currently soil moisture & water level
  type AnalogSensor implements Sensor {
    id: String!
    type: String!
    board: Board!
    dataPin: Int!
    powerPin: Int
    data: [AnalogSensorData!]
  }

  type AnalogSensorData implements SensorData {
    date: Date!
    reading: Number! # 0 to 1024 as a portion of input voltage.
  }

  # Digital Humidity and Temperature Sensor
  type DHTSensor implements Sensor {
    id: String!
    type: String!
    board: Board!
    dataPin: Int!
    powerPin: Int
    data: [DHTSensorData!]
  }

  type DHTSensorData implements SensorData {
    date: Date!
    temperature: Float! # degrees C
    humidity: Float! # percent
  }
`;

export default makeExecutableSchema({ typeDefs, resolvers });
