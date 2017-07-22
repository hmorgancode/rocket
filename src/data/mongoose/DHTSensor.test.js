'use strict';

import DHTSensor from './DHTSensor';
import { wipeTestDatabase, disconnectFromTestDatabase } from '../../test/helpers';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

describe('DHTSensor', () => {

  beforeEach(async () => {
    await wipeTestDatabase();
  });
  afterAll(async () => await disconnectFromTestDatabase());

  test('Creation', async () => {
    const testId = ObjectId();
    let testDHTSensor = await new DHTSensor({
      board: testId,
      dataPin: 0,
      data: [{ temperature: 0, humidity: 0 }]
    }).save();

    expect(testDHTSensor._id).toBeDefined();
    expect(testDHTSensor.board).toBe(testId);
    expect(testDHTSensor.dataPin).toBe(0);
    // default
    expect(testDHTSensor.type).toBe('DHT22');
    expect(testDHTSensor.data[0].date).toBeDefined();
    // Not required, no default
    expect(testDHTSensor.powerPin).toBeUndefined();
    // should trim
    await expect(new DHTSensor({board: testId, dataPin: 0, type: '   DHT22 '}).save()).resolves.toEqual(
      expect.objectContaining({ type: 'DHT22' })
    );
  });

  test('Validation', async () => {
    // required fields
    try {
      await new DHTSensor().save();
      expect('this line not to be reached due to validation failure').toBe(true);
    } catch (err) {
      expect(err.name).toBe('ValidationError');
      expect(err.errors.board.message).toBe('Path `board` is required.');
      expect(err.errors.dataPin.message).toBe('Path `dataPin` is required.');
    }

    // sensor data must have valid temperature and humidity readings
    try {
      await new DHTSensor({board: ObjectId(), dataPin: 0, data: [
        { temperature: 0 },
        { humidity: 0 },
        { temperature: -10, humidity: -10 },
        { temperature: 23, humidity: 70 }
        ]}).save();
      expect('this line not to be reached due to validation failure').toBe(true);
    } catch (err) {
      expect(err.name).toBe('ValidationError');
      expect(err.errors['data.0.humidity']).toBe('Path `humidity` is required.');
      expect(err.errors['data.1.temperature']).toBe('Path `temperature` is required.');
      expect(err.errors['data.2.humidity']).toBe('Path `humidity` (-10) is less than minimum allowed value (0).');
      expect(err.errors['data.3.temperature']).toBeUndefined();
      expect(err.errors['data.3.humidity']).toBeUndefined();
    }

  });

});
