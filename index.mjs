import getPlatform, { PLATFORM } from './utils/getPlatform.mjs';

const { default: APIClient } = await import(
  getPlatform() === PLATFORM.REACT_NATIVE ? './APIClient.native.mjs' : './APIClient.mjs'
);

export default APIClient;
