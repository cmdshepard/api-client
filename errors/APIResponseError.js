export default class APIResponseError extends Error {

  constructor(status, body) {
    super(`API Response Error${status ? `: ${status}` : ''}`);
    this.status = status;

    try {
      this.body = JSON.parse(body)
    } catch (e) {
      this.body = body;
    }
  }

}
