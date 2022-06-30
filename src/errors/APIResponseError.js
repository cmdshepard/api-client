class APIResponseError extends Error {
  /**
   * @param status {number}
   * @param statusText {string}
   * @param body {any}
   */
  constructor(status, statusText, body) {
    super(`API Response Error: ${status} ${statusText || ''}`);
    this.status = status;
    this.statusText = statusText;

    try {
      this.body = JSON.parse(body)
    } catch (e) {
      this.body = body;
    }
  }
}

module.exports = APIResponseError;
