'use strict';

import mongoose from 'mongoose';
import Promise from 'bluebird';

let connection = null;
const TEST_URI = 'mongodb://localhost/test';

async function connectToTest() {
    if (connection) {
      return connection;
    }

    mongoose.Promise = Promise;
    const options = {
      auto_reconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    };

    await mongoose.connect(TEST_URI, options);
    connection = mongoose.connection;
    connection.on('error', (e) => console.log(e));
    // currently: just throw error if initial connection fails
}

async function wipeDatabase() {
  for (const i in connection.collections) {
    await connection.collections[i].remove({});
  }
}

export async function wipeTestDatabase() {
  await connectToTest();
  await wipeDatabase();
}

export async function disconnectFromTestDatabase() {
  if (connection) {
    await mongoose.disconnect();
    connection = null;
  }
}