import { describe, it, expect } from 'vitest';
const APIResponseError = require('../../../src/errors/APIResponseError');

describe('APIResponseError', () => {
  it('should create error with status, statusText, and body', () => {
    const error = new APIResponseError(404, 'Not Found', 'Resource not found');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(APIResponseError);
    expect(error.status).toBe(404);
    expect(error.statusText).toBe('Not Found');
    expect(error.body).toBe('Resource not found');
    expect(error.message).toBe('API Response Error: 404 Not Found');
  });

  it('should handle JSON body string', () => {
    const jsonBody = JSON.stringify({ error: 'Invalid request' });
    const error = new APIResponseError(400, 'Bad Request', jsonBody);

    expect(error.body).toEqual({ error: 'Invalid request' });
  });

  it('should handle non-JSON body string', () => {
    const error = new APIResponseError(500, 'Internal Server Error', 'Plain text error');

    expect(error.body).toBe('Plain text error');
  });

  it('should handle empty statusText', () => {
    const error = new APIResponseError(500, '', 'Error body');

    expect(error.message).toBe('API Response Error: 500 ');
  });

  it('should handle null statusText', () => {
    const error = new APIResponseError(500, null, 'Error body');

    expect(error.message).toBe('API Response Error: 500 ');
  });

  it('should be throwable', () => {
    expect(() => {
      throw new APIResponseError(403, 'Forbidden', 'Access denied');
    }).toThrow(APIResponseError);

    expect(() => {
      throw new APIResponseError(403, 'Forbidden', 'Access denied');
    }).toThrow('API Response Error: 403 Forbidden');
  });

  it('should maintain stack trace', () => {
    const error = new APIResponseError(500, 'Internal Server Error', 'Server error');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('APIResponseError');
  });

  it('should handle complex JSON body', () => {
    const complexBody = JSON.stringify({
      errors: [
        { field: 'email', message: 'Invalid email' },
        { field: 'password', message: 'Too short' }
      ],
      code: 'VALIDATION_ERROR'
    });
    const error = new APIResponseError(422, 'Unprocessable Entity', complexBody);

    expect(error.body).toEqual({
      errors: [
        { field: 'email', message: 'Invalid email' },
        { field: 'password', message: 'Too short' }
      ],
      code: 'VALIDATION_ERROR'
    });
  });
});
