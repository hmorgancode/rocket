// A simple module for connecting to mongodb using mongoose
'use strict';

import mongoose from 'mongoose';
import Promise from 'bluebird';
// mongoose supports setting a Promise library. we're using bluebird
// over native for a few reasons, mostly performance.
mongoose.Promise = Promise;

let connection = null;

/**
 * Connects to the database. (Abstracts away mongodb)
 * @param  {string} uri the database to connect to
 */
export async function connectToDatabase(uri) {
  if (connection || uri == null) {
    return;
  }

  const options = {
    auto_reconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  };

  await mongoose.connect(uri, options);
  connection = mongoose.connection;
  // currently: just log error if initial connection fails
  connection.on('error', (e) => console.error(e));
};

/**
 * Disconnects from the database (if connected)
 */
export async function disconnectFromDatabase() {
  if (connection) {
    await mongoose.disconnect();
    connection = null;
  }
}
