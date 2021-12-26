export const PLATFORM = {
  WEB: 'WEB',
  NODE: 'NODE',
  REACT_NATIVE: 'REACT_NATIVE',
};

const getPlatform = () => {
  let platform;

  if (typeof document != 'undefined') {
    platform = PLATFORM.WEB;
  } else if (typeof navigator != 'undefined' && navigator.product === 'ReactNative') {
    platform = PLATFORM.REACT_NATIVE;
  } else {
    platform = PLATFORM.NODE;
  }

  return platform;
};

export default getPlatform;
