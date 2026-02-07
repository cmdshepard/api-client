import { describe, it, expect } from 'vitest';
const NetworkError = require('../../../src/errors/NetworkError');

describe('NetworkError', () => {
  it('should create a NetworkError with correct message', () => {
    const error = new NetworkError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(NetworkError);
    expect(error.message).toBe('Network error');
  });

  it('should have correct error name', () => {
    const error = new NetworkError();

    expect(error.name).toBe('Error');
  });

  it('should be throwable', () => {
    expect(() => {
      throw new NetworkError();
    }).toThrow(NetworkError);

    expect(() => {
      throw new NetworkError();
    }).toThrow('Network error');
  });

  it('should maintain stack trace', () => {
    const error = new NetworkError();

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('NetworkError');
  });
});
