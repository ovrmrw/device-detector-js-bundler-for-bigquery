const DeviceDetector = require("device-detector-js");

const deviceDetector = new DeviceDetector();

if (typeof global !== 'undefined') {
  global.deviceDetector = deviceDetector;
}
