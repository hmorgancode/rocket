'use strict';

import resolvers from './resolvers';
import { wipeTestDatabase, disconnectFromTestDatabase } from '../../test/helpers';
import mongoose from 'mongoose';
import Plant from '../mongoose/Plant';
import Board from '../mongoose/Board';
import Sensor from '../mongoose/Sensor';
import Promise from 'bluebird';
import casual from 'casual';
casual.seed(123);

var testBoard, testSensor, testPlant;
beforeEach(async () => {
  await wipeTestDatabase();
  testBoard = await Board.create({ location: 'testRoom' });
  testSensor = await Sensor.create({ type: 'Moisture', board: testBoard._id, dataPin: 0 });
  testPlant = await Plant.create({ name: 'testPlant', board: testBoard._id, sensors: [testSensor._id] });
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
    expect(res.length).toBe(1);
    expect(res[0].type).toBe('Moisture');
  });

  // if given _id: plant, board, and sensor's resolvers should use findById
  // instead of findOne, so test that route as well.
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
    let res = await resolvers.Query.sensor(null, { type: 'Moisture', board: testSensor.board, dataPin: 0 });
    expect(res).toEqual(expect.objectContaining({ type: 'Moisture', board: testSensor.board, dataPin: 0 }));
    res = await resolvers.Query.sensor(null, { _id: res._id });
    expect(res).toEqual(expect.objectContaining({ type: 'Moisture', board: testSensor.board, dataPin: 0 }));
  });
});

describe('Plant', () => {
  test('board', async () => {
    const res = await resolvers.Plant.board({ board: testBoard._id });
    expect(res).toEqual(expect.objectContaining({ location: testBoard.location, _id: testBoard._id }));
  });
  test('sensors', async () => {
    const res = await resolvers.Plant.sensors({ sensors: [testSensor._id] });
    expect(res).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'Moisture' })]));
  });
});

describe('Board', () => {
  test('sensors', async () => {
    const res = await resolvers.Board.sensors({ sensors: [testSensor._id] });
    expect(res).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'Moisture' })]));
  });
});

describe('Sensor', () => {
  test('board', async () => {
    const res = await resolvers.Sensor.board({ board: testBoard._id });
    expect(res).toEqual(expect.objectContaining({ location: testBoard.location, _id: testBoard._id }));
  });
});

describe('Mutation', () => {
  test('createPlant', async () => {
    const testPlant2 = { name: casual.word, thumbnail: casual.url, board: testBoard._id };
    const res = await resolvers.Mutation.createPlant({}, testPlant2);
    expect(res).toEqual(expect.objectContaining(testPlant2));
    const plants = await Plant.find().lean();
    expect(plants.length).toBe(2);
  });
  test('updatePlant', async () => {
    const res = await resolvers.Mutation.updatePlant({}, { _id: testPlant._id, name: 'updatedTestPlant' });
    expect(res).toEqual(expect.objectContaining({ _id: testPlant._id, name: 'updatedTestPlant' }));
    await expect(Plant.find().lean()).resolves.toEqual(expect.arrayContaining([expect.objectContaining(res)]));
  });
  test('deletePlant', async () => {
    const res = await resolvers.Mutation.deletePlant({}, { _id: testPlant._id });
    expect(res).toEqual(expect.objectContaining({ _id: testPlant._id, name: testPlant.name }));
    let plants = await Plant.find().lean();
    expect(Array.isArray(plants)).toBe(true);
    expect(plants.length).toBe(0);
  });

  test('createBoard', async () => {
    const testBoard2 = { location: casual.word };
    const res = await resolvers.Mutation.createBoard({}, testBoard2);
    expect(res).toEqual(expect.objectContaining(testBoard2));
    const boards = await Board.find().lean();
    expect(boards.length).toBe(2);
  });
  test('updateBoard', async () => {
    const res = await resolvers.Mutation.updateBoard({}, { _id: testBoard._id, location: 'updatedTestRoom' });
    expect(res).toEqual(expect.objectContaining({ _id: testBoard._id, location: 'updatedTestRoom' }));
    await expect(Board.find().lean()).resolves.toEqual(expect.arrayContaining([expect.objectContaining(res)]));
  });
  test('deleteBoard', async () => {
    const res = await resolvers.Mutation.deleteBoard({}, { _id: testBoard._id });
    expect(res).toEqual(expect.objectContaining({ _id: testBoard._id, location: testBoard.location }));
    let boards = await Board.find().lean();
    expect(Array.isArray(boards)).toBe(true);
    expect(boards.length).toBe(0);
  });

  test('createSensor', async () => {
    const testSensor2 = { type: 'Moisture', board: testBoard._id, dataPin: 0 };
    const res = await resolvers.Mutation.createSensor({}, testSensor2);
    expect(res).toEqual(expect.objectContaining(testSensor2));
    const sensors = await Sensor.find().lean();
    expect(sensors.length).toBe(2);
    // providing the Board should result in the sensor's _id being added to the board's sensors field
    // create a setter in mongoose?
  });
  test('updateSensor', async () => {
    const res = await resolvers.Mutation.updateSensor({}, { _id: testSensor._id, dataPin: 1 });
    expect(res).toEqual(expect.objectContaining({ _id: testSensor._id, dataPin: 1 }));
    await expect(Sensor.find().lean()).resolves.toEqual(expect.arrayContaining([expect.objectContaining(res)]));
  });
  test('deleteSensor', async () => {
    const res = await resolvers.Mutation.deleteSensor({}, { _id: testSensor._id });
    expect(res).toEqual(expect.objectContaining({ _id: testSensor._id,
      type: testSensor.type, dataPin: testSensor.dataPin }));
    let sensors = await Sensor.find().lean();
    expect(Array.isArray(sensors)).toBe(true);
    expect(sensors.length).toBe(0);
  });

  test('createSensorData', async () => {
    const input = {
      location: testBoard.location,
      dataPin: testSensor.dataPin,
      data: {
        reading: casual.integer(0, 1023)
      }
    };
    const res = await resolvers.Mutation.createSensorData({}, input);
    expect(res).toEqual(expect.objectContaining({ _id: testSensor._id }));
    expect(Array.isArray(res.data) && res.data.length).toBe(1);
    expect(res.data[0].reading).toBe(input.data.reading);
    expect(res.data[0].date).toBeDefined();
  });

  test.only('deleteSensorData', async () => {
    // Add some data first
    await resolvers.Mutation.createSensorData({}, {
      location: testBoard.location,
      dataPin: testSensor.dataPin,
      data: {
        reading: casual.integer(0, 1023)
      }
    });
    let data = (await Sensor.findById({ _id: testSensor._id })).data;
    expect(Array.isArray(data) && data.length).toBe(1);
    // Deleting sensor data should return the modified sensor
    // (@TODO refresh yourself on convention / best practice for returning from updates/deletes)
    const res = await resolvers.Mutation.deleteSensorData({}, { _id: testSensor._id });
    expect(res).toEqual(expect.objectContaining({ _id: testSensor._id }));
    expect(Array.isArray(res.data) && res.data.length).toBe(0);
    data = (await Sensor.findById({ _id: testSensor._id })).data;
    expect(Array.isArray(data) && data.length).toBe(0);
  });

});
