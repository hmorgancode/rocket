'use strict';

// do this before imports, so that our mock is EVERYWHERE
global.console.error = jest.fn();
import { connectToDatabase, disconnectFromDatabase } from './databaseConnection';
import mongoose from 'mongoose';
require('dotenv').config();

describe('databaseConnection', () => {

  beforeEach(() => {
    disconnectFromDatabase();
  });

  test('connectToDatabase', async () => {
    // Should be a noop when not given a string
    await expect(connectToDatabase()).resolves.toBeUndefined();
    expect(mongoose.connection.host).toBe(null);
    // connecting to database shouldn't return anything. (mongoose.connection should be isolated)
    await expect(connectToDatabase(process.env.TEST_DB_URI)).resolves.toBeUndefined();
    expect(mongoose.connection.host).toBeDefined();
    // repeat calls should be noops
    await expect(connectToDatabase(process.env.TEST_DB_URI)).resolves.toBeUndefined();
    // connection issues should output errors to console
    mongoose.connection.emit('error');
    expect(console.error).toHaveBeenCalledTimes(1);

  });

  test('disconnectFromDatabase', async () => {
    // calling while disconnected should be a noop
    await expect(disconnectFromDatabase()).resolves.toBeUndefined();
    // should disconnect without issues and without returning anything
    await connectToDatabase(process.env.TEST_DB_URI);
    await expect(disconnectFromDatabase()).resolves.toBeUndefined();
  });

});
