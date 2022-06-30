const fetchRetry = require('fetch-retry');
const APIResponseError = require('./errors/APIResponseError');
const NetworkError = require('./errors/NetworkError');

export const CONTENT_TYPE = {
  JSON: 'application/json',
  FORM_URL_ENCODED: 'application/x-www-form-urlencoded',
};

export default class BaseAPIClient {

  static CONTENT_TYPE = CONTENT_TYPE;

  constructor(opts = {
    host: '0.0.0.0',
    contentType: CONTENT_TYPE.JSON,
    headers: { accept: CONTENT_TYPE.JSON },
    payloadSignMethod: null,
  }) {
    this.host = opts.host;
    this.contentType = opts.contentType;
    this.headers = opts.headers;
    this.payloadSignMethod = opts.payloadSignMethod;
    this.fetch = opts.fetch;
    this.retryOpts = opts.retryOpts || { retries: 0 };
  }

  /**
   * @param path {string}
   * @param headers {?object}
   * @returns {Promise<Object>}
   */
  get = (path, headers = undefined) => this._request({
    path,
    headers,
    method: 'GET',
  });

  /**
   * @param path {string}
   * @param body {?object}
   * @param headers {?object}
   * @returns {Promise<Object>}
   */
  post = (path, body = undefined, headers = undefined) => this._request({
    path,
    body,
    headers,
    method: 'POST',
  });

  /**
   * @param path {string}
   * @param body {?object}
   * @param headers {?object}
   * @returns {Promise<Object>}
   */
  patch = (path, body = undefined, headers = undefined) => this._request({
    path,
    body,
    headers,
    method: 'PATCH',
  });

  /**
   * @param path {string}
   * @param body {?object}
   * @param headers {?object}
   * @returns {Promise<Object>}
   */
  put = (path, body = undefined, headers = undefined) => this._request({
    path,
    body,
    headers,
    method: 'PUT',
  });

  /**
   * @param path {string}
   * @param body {?object}
   * @param headers {?headers}
   * @returns {Promise<Object>}
   */
  del = (path, body = undefined, headers = undefined) => this._request({
    path,
    body,
    headers,
    method: 'DELETE',
  });

  /**
   * @param method {'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'}
   * @param path {string}
   * @param body {?object}
   * @param headers {?object}
   * @returns {Promise<object>}
   * @private
   */
  async _request({
    method,
    path,
    body = null,
    headers = this.headers || {},
  }) {
    let response;

    try {
      const url = `${this.host}${path}`;
      let bodyToSend;

      if (body) {
        headers['content-type'] = this.contentType;

        switch (this.contentType) {
          case CONTENT_TYPE.JSON:
            bodyToSend = JSON.stringify(body);
            break;
          case CONTENT_TYPE.FORM_URL_ENCODED:
            bodyToSend = new URLSearchParams(body).toString();
            break;
        }

        if (typeof this.payloadSignMethod === 'function') {
          bodyToSend = await this.payloadSignMethod(bodyToSend);
        }
      }

      response = await fetchRetry(this.fetch)(url, {
        ...this.retryOpts,
        method,
        headers,
        body: bodyToSend
      });
    } catch (e) {
      console.error(e);
      throw new NetworkError();
    }

    if (!response.ok) {
      throw new APIResponseError(
        response.status,
        response.statusText,
        await response.text()
      );
    }

    let responseBody = await response.text();

    try {
      responseBody = JSON.parse(responseBody);
    } catch (e) {
      // no-op
    }

    return responseBody;
  }

}
