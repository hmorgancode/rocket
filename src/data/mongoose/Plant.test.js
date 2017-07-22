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
    const testId = ObjectId();
    let testPlant = await new Plant({
      name: 'foo',
      board: testId
    }).save();

    expect(testPlant._id).toBeDefined();
    expect(testPlant.board).toBe(testId);
    // not required, no default
    expect(testPlant.altName).toBeUndefined();
    expect(testPlant.notes).toBeUndefined();
    // should be trimmed
    await expect(new Plant({
      board: testId,
      name: ' foo ',
      thumbnail: ' foo ',
      altName: ' foo ',
      tags: [' bar ']
    }).save()).resolves.toEqual(expect.objectContaining({
      name: 'foo',
      thumbnail: 'foo',
      altName: 'foo',
      tags: expect.arrayContaining(['bar'])
    }));
  });

  test('Validation', async () => {
    // required fields
    try {
      await new Plant().save();
      expect('this line not to be reached due to validation failure').toBe(true);
    } catch (err) {
      expect(err.name).toBe('ValidationError');
      expect(err.errors.name.message).toBe('Path `name` is required.');
      expect(err.errors.board.message).toBe('Path `board` is required.');
    }
  });
});
