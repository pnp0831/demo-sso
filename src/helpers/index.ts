import DeviceDetector from "device-detector-js";

export const parseUserAgent = (userAgent) => {
  const deviceDetector = new DeviceDetector();

  const device = deviceDetector.parse(userAgent);

  return device;
};
