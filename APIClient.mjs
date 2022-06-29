import fetch from 'cross-fetch';
import BaseAPIClient from './BaseAPIClient.mjs';
import APIResponseError from './errors/APIResponseError.mjs';
import NetworkError from './errors/NetworkError.mjs';

class APIClient extends BaseAPIClient {
  constructor({
    host,
    contentType,
    headers,
    payloadSignMethod,
    retryOpts,
  } = {
    host: '0.0.0.0',
    contentType: BaseAPIClient.CONTENT_TYPE.JSON,
    headers: { accept: BaseAPIClient.CONTENT_TYPE.JSON },
    payloadSignMethod: null,
    retryOpts: {},
  }) {
    super({
      host,
      contentType,
      headers,
      payloadSignMethod,
      retryOpts,
      fetch,
    });
  }
}

export default {
  APIClient,
  APIResponseError,
  NetworkError,
};
