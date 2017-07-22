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
      dataPin: 0
    }).save();
    expect(testDHTSensor._id).toBeDefined();
    expect(testDHTSensor.board).toBe(testId);
    expect(testDHTSensor.dataPin).toBe(0);
    // default
    expect(testDHTSensor.type).toBe('DHT22');
    // Not required, no default
    expect(testDHTSensor.powerPin).toBeUndefined();
    // should trim
    await expect(new DHTSensor({board: testId, dataPin: 0, type: '   DHT22 '}).save()).resolves.toEqual(
      expect.objectContaining({ type: 'DHT22' })
    );
  });

  test('Validation', () => {

  });

});
