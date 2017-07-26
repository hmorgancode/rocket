'use strict';

import Sensor from './Sensor';
import Board from './Board';
import { wipeTestDatabase, disconnectFromTestDatabase } from '../../test/helpers';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

describe('Sensor', () => {

  beforeEach(async () => {
    await wipeTestDatabase();
  });
  afterAll(async () => await disconnectFromTestDatabase());

  test('Creation', async () => {
    const testId = ObjectId();
    const testSensor = await Sensor.create({
      type: 'Moisture',
      board: testId,
      dataPin: 0
    });

    expect(testSensor._id).toBeDefined();
    expect(testSensor.board).toBe(testId);
    expect(testSensor.dataPin).toBe(0);
    expect(testSensor.type).toBe('Moisture');
    // not required, no default
    expect(testSensor.powerPin).toBeUndefined();
  });

  // test('Sensor Data update', () => {

  // });

  test('Validation', async () => {
    // Required fields:
    // (for convenience, we're using try/catch instead of other approaches)
    try {
      await new Sensor().save();
      expect('this line not to be reached due to validation failure').toBe(true);
    } catch (err) {
      expect(err.name).toBe('ValidationError');
      expect(err.errors.type.message).toBe('Path `type` is required.');
      expect(err.errors.board.message).toBe('Path `board` is required.');
      expect(err.errors.dataPin.message).toBe('Path `dataPin` is required.');
    }

    // Should reject invalid type names:
    try {
      await Sensor.create({ board: ObjectId(), dataPin: 0, type: 'foo'});
      expect('this line not to be reached due to validation failure').toBe(true);
    } catch (err) {
      expect(err.name).toBe('ValidationError');
      expect(err.errors.type.message).toBe('`foo` is not a valid enum value for path `type`.')
    }
    await expect(Sensor.create({ board: ObjectId(), dataPin: 0, type: 'Moisture' })).resolves.toBeDefined();
    await expect(Sensor.create({ board: ObjectId(), dataPin: 0, type: 'Water Level' })).resolves.toBeDefined();
    await expect(Sensor.create({ board: ObjectId(), dataPin: 0, type: 'DHT22' })).resolves.toBeDefined();

  });
});
