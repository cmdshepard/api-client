export default class APIResponseError extends Error {

  constructor(status) {
    super(`API Response Error${status ? `: ${status}` : ''}`);
  }

}
