'use strict';

import AnalogSensor from './AnalogSensor';
import Board from './Board';
import { wipeTestDatabase, disconnectFromTestDatabase } from '../../test/helpers';
import Promise from 'bluebird';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

describe('AnalogSensor', () => {

  beforeEach(async () => {
    await wipeTestDatabase();
  });
  afterAll(async () => await disconnectFromTestDatabase());

  test('Creation', async () => {
    const testId = ObjectId();
    const testSensor = await new AnalogSensor({
      type: 'Moisture   ',
      board: testId,
      dataPin: 0
    }).save();

    expect(testSensor._id).toBeDefined();
    expect(testSensor.board).toBe(testId);
    expect(testSensor.dataPin).toBe(0);
    // Should trim
    expect(testSensor.type).toBe('Moisture');
    // not required, no default
    expect(testSensor.powerPin).toBeUndefined();
  });

  // test('Sensor Data update', () => {

  // });

  test('Validation', async () => {
    // For convenience (accessing nested error messages),
    // we're using try/catch here instead of another approach

    // Required fields:
    try {
      await new AnalogSensor().save();
      expect('this line not to be reached due to validation failure').toBe(true);
    } catch (err) {
      expect(err.name).toBe('ValidationError');
      expect(err.errors.type.message).toBe('Path `type` is required.');
      expect(err.errors.board.message).toBe('Path `board` is required.');
      expect(err.errors.dataPin.message).toBe('Path `dataPin` is required.');
    }

    // Sensor data should be limited 0-1023 and given dates if not provided one.
    // Data pin should have a minimum value of 0
    try {
      await new AnalogSensor({
        type: 'Test',
        board: ObjectId(),
        dataPin: -1,
        data: [{reading: -1}, {date: new Date(), reading: 0}, {reading: 1023}, {reading: 1024}]
      }).save();
      expect('this line not to be reached due to validation failure').toBe(true);
    } catch (err) {
      expect(err.errors.dataPin.name).toBe('ValidatorError');
      expect(err.errors['data.0.reading'].name).toBe('ValidatorError');
      expect(err.errors['data.3.reading'].name).toBe('ValidatorError');
      expect(err.errors.dataPin.message).toBe('Path `dataPin` (-1) is less than minimum allowed value (0).');
      expect(err.errors['data.0.reading'].message).toBe('Path `reading` (-1) is less than minimum allowed value (0).');
      expect(err.errors['data.3.reading'].message).toBe('Path `reading` (1024) is more than maximum allowed value (1023).');
      expect(err.errors['data.0.date']).toBeUndefined();
      expect(err.errors['data.1.date']).toBeUndefined();
    }
  });
});
