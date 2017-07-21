'use strict';

import resolvers from './resolvers';

describe('Sensor', () => {

  test('__resolveType', () => {
    const __resolveType = resolvers.Sensor.__resolveType;
    const analogSensor = { type: 'AnalogMoisture' };
    const DHTSensor = { type: 'DHT22' };
    expect(__resolveType(analogSensor)).toBe('AnalogSensor');
    expect(__resolveType(DHTSensor)).toBe('DHTSensor');
  });
});

describe('SensorData', () => {

  test('__resolveType', () => {
    const __resolveType = resolvers.SensorData.__resolveType;
    const analogSensorData = { reading: 111 };
    const DHTSensorData = { humidity: 111, temperature: 222 };
    expect(__resolveType(analogSensorData)).toBe('AnalogSensorData');
    expect(__resolveType(DHTSensorData)).toBe('DHTSensorData');
  });
});
