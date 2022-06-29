import fetch from 'cross-fetch';
import BaseAPIClient from './BaseAPIClient.mjs';
export APIResponseError from './errors/APIResponseError.mjs';
export NetworkError from './errors/NetworkError.mjs';

export default class APIClient extends BaseAPIClient {
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
