'use strict';

import AnalogSensor from './AnalogSensor';
import Board from './Board';
import { wipeTestDatabase, disconnectFromTestDatabase } from '../../test/helpers';
import Promise from 'bluebird';

describe('AnalogSensor', () => {

  let testBoardModel = new Board({
    location: 'Hallway',
    type: 'Arduino Mega',
    isRemote: false
  });
  let testBoard;

  beforeEach(async () => {
    await wipeTestDatabase();
    testBoard = await testBoardModel.save();
  });

  afterAll(async () => await disconnectFromTestDatabase());

  test('Creation', async () => {
    const testSensorModel = new AnalogSensor({
      type: 'Moisture',
      board: testBoard._id,
      dataPin: 14
    });
    const testSensor = await testSensorModel.save();
    expect(testSensor.type).toBe('Moisture');
    expect(testSensor.board).toBe(testBoard._id);
    expect(testSensor.dataPin).toBe(14);
  });

  // test('Sensor Data update', () => {

  // });

  test('Validation', () => {
    // We're reliant on .validate's callback, so, we're sticking with promises here instead of using await.

    // AnalogSensor should have required fields
    const test1 = new Promise((resolve) => {
      const emptyEntry = new AnalogSensor();
      emptyEntry.validate((err) => {
        expect(err.errors.type.message).toBe('Path `type` is required.');
        expect(err.errors.board.message).toBe('Path `board` is required.');
        expect(err.errors.dataPin.message).toBe('Path `dataPin` is required.');
        resolve();
      });
    });

    // @TODO test casting of inputs? check out mongo's behavior more

    // Sensor data should be limited 0-1023 and given dates if not provided one.
    const test2 = new Promise((resolve) => {
      const mixedDateEntry = new AnalogSensor({
        type: 'Test',
        data: [{reading: -1}, {date: new Date(), reading: 0}, {reading: 1023}, {reading: 1024}]
      });
      mixedDateEntry.validate((err) => {
        expect(err.errors['data.0.reading'].message).toBe('Path `reading` (-1) is less than minimum allowed value (0).');
        expect(err.errors['data.3.reading'].message).toBe('Path `reading` (1024) is more than maximum allowed value (1023).');
        expect(err.errors['data.0.date']).toBeUndefined();
        expect(err.errors['data.1.date']).toBeUndefined();
        resolve();
      });
    });

    return Promise.all([test1, test2]);
  });

});
