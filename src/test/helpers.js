// Helper functions for tests.
// Currently just handles connecting to, wiping, and disconnecting from
// the test database using the databaseConnection module.
'use strict';

import { connectToDatabase, disconnectFromDatabase } from '../modules/databaseConnection';
// Import mongoose for direct access to the .connection object.
// (we need it to wipe the test database)
import mongoose from 'mongoose';

require('dotenv').config();
let connection = null;
// const TEST_DB_URI = mongodb://localhost/test;

async function connect() {
  if (connection) {
    return;
  }
  await connectToDatabase(process.env.TEST_DB_URI);
  connection = mongoose.connection;
}

async function wipe() {
  if (connection) {
    for (const i in connection.collections) {
      await connection.collections[i].remove({});
    }
  }
}

export async function wipeTestDatabase() {
  await connect();
  await wipe();
}

export async function disconnectFromTestDatabase() {
  await disconnectFromDatabase();
}



