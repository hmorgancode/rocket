'use strict';

import Plant from './Plant';
import { wipeTestDatabase, disconnectFromTestDatabase } from '../../test/helpers';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

describe('Plant', () => {

  beforeEach(async () => {
    await wipeTestDatabase();
  });
  afterAll(async () => await disconnectFromTestDatabase());

  test('Creation', async () => {
    let testPlantModel = new Plant({
      location: 'Hallway'
    });
    let testPlant = await testPlantModel.save();
  });

  test('Validation', () => {
    // We're reliant on .validate's callback, so, we're sticking with promises here instead of using await.

    // Plant should have required fields
    const test1 = new Promise((resolve) => {

    });

    // @TODO test casting of inputs? check out mongo's behavior more

    // Sensor data should be limited 0-1023 and given dates if not provided one.
    const test2 = new Promise((resolve) => {

    });

    return Promise.all([test1, test2]);
  });

});
