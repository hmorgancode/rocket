'use strict';

import { mockServer } from 'graphql-tools';
import schema from './schema';

// test interfaces/unions? graphql has a lot of built in warnings/errors that
// just throw on import if the schema/resolvers are off. Might not need
// this for much. Integration tests, maybe?

test('schema should work', async () => {
  const testMockServer = mockServer(schema);
  const testResult = await testMockServer.query(`{
    plants {
      _id
      name
      board {
        _id
        location
      }
    }
    boards {
      _id
      location
    }
    sensors {
      _id
      board {
        _id
        location
      }
      dataPin
      type
    }
  }`);
  expect(testResult).toEqual({ data: expect.objectContaining({
    plants: expect.anything(),
    boards: expect.anything(),
    sensors: expect.anything()
  })});
});
