'use strict';

import Board from './Board';
import { wipeTestDatabase, disconnectFromTestDatabase } from '../../test/helpers';
import Promise from 'bluebird';

describe('Board', () => {

  beforeEach(async () => {
    await wipeTestDatabase();
  });

  afterAll(async () => await disconnectFromTestDatabase());

  test('Creation', async () => {
    let testBoardModel = new Board({
      location: 'Hallway'
    });
    let testBoard = await testBoardModel.save();
  });

  test('Validation', () => {
    // We're reliant on .validate's callback, so, we're sticking with promises here instead of using await.

    // Board should have required fields
    const test1 = new Promise((resolve) => {

    });

    // @TODO test casting of inputs? check out mongo's behavior more

    // Sensor data should be limited 0-1023 and given dates if not provided one.
    const test2 = new Promise((resolve) => {

    });

    return Promise.all([test1, test2]);
  });

});
