import APIClient from './APIClient';
import getPlatform, { PLATFORM } from './utils/getPlatform';

if (getPlatform() === PLATFORM.NODE) {
  APIClient.fetch = require('node-fetch');
}

export default APIClient;
