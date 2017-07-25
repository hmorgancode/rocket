'use strict';

import resolvers from './resolvers';
import { wipeTestDatabase, disconnectFromTestDatabase } from '../../test/helpers';
import mongoose from 'mongoose';
import Plant from '../mongoose/Plant';
import Board from '../mongoose/Board';
import AnalogSensor from '../mongoose/AnalogSensor';
import DHTSensor from '../mongoose/DHTSensor';
import Promise from 'bluebird';
import casual from 'casual';
casual.seed(123);
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

  // if given _id, plant, board, and sensor's resolvers should use findById instead of findOne
  test('plant', async () => {
    let res = await resolvers.Query.plant(null, { name: 'testPlant' });
    expect(res).toEqual(expect.objectContaining({ name: 'testPlant', board: testPlant.board }));
    res = await resolvers.Query.plant(null, { _id: res._id });
    expect(res).toEqual(expect.objectContaining({ name: 'testPlant', board: testPlant.board }));
  });
  test('board', async () => {
    let res = await resolvers.Query.board(null, { location: 'testRoom' });
    expect(res).toEqual(expect.objectContaining({ location: 'testRoom' }));
    res = await resolvers.Query.board(null, { _id: res._id });
    expect(res).toEqual(expect.objectContaining({ location: 'testRoom' }));
  });
  test('sensor', async () => {
    let res = await resolvers.Query.sensor(null, { type: 'testAnalog', board: testAnalogSensor.board, dataPin: 0 });
    expect(res).toEqual(expect.objectContaining({ type: 'testAnalog', board: testAnalogSensor.board, dataPin: 0 }));
    res = await resolvers.Query.sensor(null, { _id: res._id });
    expect(res).toEqual(expect.objectContaining({ type: 'testAnalog', board: testAnalogSensor.board, dataPin: 0 }));
    res = await resolvers.Query.sensor(null, { type: 'testDHT', board: testDHTSensor.board, dataPin: 0 });
    expect(res).toEqual(expect.objectContaining({ type: 'testDHT', board: testDHTSensor.board, dataPin: 0 }));
    res = await resolvers.Query.sensor(null, { _id: res._id });
    expect(res).toEqual(expect.objectContaining({ type: 'testDHT', board: testDHTSensor.board, dataPin: 0 }));
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

describe('Mutation', () => {
  test('createPlant', async () => {
    const testPlant = { name: casual.word, thumbnail: casual.url, board: testBoard._id };
    const res = await resolvers.Mutation.createPlant({}, testPlant);
    expect(res).toEqual(expect.objectContaining(testPlant));
    const plants = await Plant.find().lean();
    expect(plants.length).toBe(2);
  });






  test('createBoard', async () => {
    const testBoard = { location: casual.word };
    const res = await resolvers.Mutation.createBoard({}, testBoard);
    expect(res).toEqual(expect.objectContaining(testBoard));
    const boards = await Board.find().lean();
    expect(boards.length).toBe(2);
  });



  test.skip('createSensor', async () => {
    const testSensor = { type: casual.word, board: testBoard._id, dataPin: casual.integer };
    const res = await resolvers.Mutation.createSensor({}, testSensor);
    expect(res).toEqual(expect.objectContaining(testSensor));
    const sensors = await Sensor.find().lean();
    expect(sensors.length).toBe(2);
  });

});
