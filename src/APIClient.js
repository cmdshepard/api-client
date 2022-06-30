const fetch = require('cross-fetch');
const BaseAPIClient = require('./BaseAPIClient');
const APIResponseError = require('./errors/APIResponseError');
const NetworkError = require('./errors/NetworkError');

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

module.exports = {
  APIClient,
  APIResponseError,
  NetworkError,
};
