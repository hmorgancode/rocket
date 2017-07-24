'use strict';

import resolvers from './resolvers';
import { wipeTestDatabase, disconnectFromTestDatabase } from '../../test/helpers';
import Plant from '../mongoose/Plant';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

beforeEach(async () => {
  await wipeTestDatabase();
});
afterAll(async () => await disconnectFromTestDatabase());

describe('Query', () => {
  test.only('plants', async () => {
    await Plant.create({ name: 'testPlant', board: ObjectId() });
    await expect(Plant.find({})).toBe(expect.objectContaining({ name: 'testPlant' }));
    expect(false).toBe(true);
  });
});

describe('Sensor', () => {
  test('__resolveType', () => {
    const __resolveType = resolvers.Sensor.__resolveType;
    const analogSensor = { type: 'AnalogMoisture' };
    const DHTSensor = { type: 'DHT22' };
    expect(__resolveType(analogSensor)).toBe('AnalogSensor');
    expect(__resolveType(DHTSensor)).toBe('DHTSensor');
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
