import BaseAPIClient from './BaseAPIClient.mjs';

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
  }) {
    super({
      host,
      contentType,
      headers,
      payloadSignMethod,
      retryOpts,
      fetch: fetch,
    });
  }
}
