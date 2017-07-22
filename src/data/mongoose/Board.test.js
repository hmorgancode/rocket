'use strict';

import Board from './Board';
import { wipeTestDatabase, disconnectFromTestDatabase } from '../../test/helpers';

describe('Board', () => {

  beforeEach(async () => {
    await wipeTestDatabase();
  });
  afterAll(async () => await disconnectFromTestDatabase());

  // Confirm that documents can save with required fields,
  // and that defaults and trim behavior hasn't changed.
  test('Creation', async () => {
    const testBoard = await new Board({
      location: '  Hallway   ',
      thumbnail: '  foo   ',
      type: 'Arduino Mega    '
    }).save();

    expect(testBoard._id).toBeDefined();
    // These fields should be trimmed
    expect(testBoard.location).toBe('Hallway');
    expect(testBoard.thumbnail).toBe('foo');
    expect(testBoard.type).toBe('Arduino Mega');
    // This field should default to true
    expect(testBoard.isRemote).toBe(true);
  });

  test('Validation', async () => {
    // Location should be required
    await expect(new Board({}).save()).rejects.toEqual(expect.objectContaining({
      name: 'ValidationError',
      message: expect.stringContaining('Path `location` is required')
    }));
    // Location should be unique
    await new Board({ location: 'Hallway' }).save();
    await expect(new Board({ location: 'Hallway' }).save()).rejects.toEqual(expect.objectContaining({
      name: 'MongoError',
      errmsg: expect.stringContaining('duplicate key error')
    }));
  });

});
