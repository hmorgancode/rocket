'use strict';

import resolvers from './resolvers';
import { wipeTestDatabase, disconnectFromTestDatabase } from '../../test/helpers';
import mongoose from 'mongoose';
import Plant from '../mongoose/Plant';
import Board from '../mongoose/Board';
import AnalogSensor from '../mongoose/AnalogSensor';
import DHTSensor from '../mongoose/DHTSensor';
import Promise from 'bluebird';
const ObjectId = mongoose.Types.ObjectId;

var testPlant, testBoard, testAnalogSensor, testDHTSensor;
beforeEach(async () => {
  await wipeTestDatabase();
  testPlant = await Plant.create({ name: 'testPlant', board: ObjectId() });
  testBoard = await Board.create({ location: 'testRoom' });
  testAnalogSensor = await AnalogSensor.create({ type: 'testAnalog', board: ObjectId(), dataPin: 0 });
  testDHTSensor = await DHTSensor.create({ type: 'testDHT', board: ObjectId(), dataPin: 0 });
});
afterAll(async () => await disconnectFromTestDatabase());

describe('Query', () => {
  test('plants', async () => {
    const res = await resolvers.Query.plants();
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('testPlant');
  });
  test('boards', async () => {
    const res = await resolvers.Query.boards();
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(1);
    expect(res[0].location).toBe('testRoom');
  });
  test('sensors', async () => {
    const res = await resolvers.Query.sensors();
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(2);
    expect(res).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'testAnalog' }),
      expect.objectContaining({ type: 'testDHT'})]));
  });
});

describe('Plant', () => {
  test('board', async () => {
    const res = await resolvers.Plant.board({ board: testBoard._id });
    expect(res).toEqual(expect.objectContaining({ location: testBoard.location, _id: testBoard._id }));
  });
  test('sensors', async () => {
    const res = await resolvers.Plant.sensors({ sensors: [testAnalogSensor._id, testDHTSensor._id]});
    expect(res).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'testAnalog' }),
      expect.objectContaining({ type: 'testDHT'})]));
  });
});

describe('Board', () => {
  test('sensors', async () => {
    const res = await resolvers.Board.sensors({ sensors: [testAnalogSensor._id, testDHTSensor._id]});
    expect(res).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'testAnalog' }),
      expect.objectContaining({ type: 'testDHT'})]));
  });
});

describe('Sensor', () => {
  test('board', async () => {
    const res = await resolvers.Sensor.board({ board: testBoard._id });
    expect(res).toEqual(expect.objectContaining({ location: testBoard.location, _id: testBoard._id }));
  });
});

describe('SensorData', () => {
  test('__resolveType', () => {
    const __resolveType = resolvers.SensorData.__resolveType;
    const analogSensorData = { reading: 111 };
    const DHTSensorData = { humidity: 111, temperature: 222 };
    expect(__resolveType(analogSensorData)).toBe('AnalogSensorData');
    expect(__resolveType(DHTSensorData)).toBe('DHTSensorData');
  });
});
