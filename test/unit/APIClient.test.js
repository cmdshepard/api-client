import { describe, it, expect } from 'vitest';

const { APIClient, APIResponseError, NetworkError } = require('../../src/APIClient');

describe('APIClient - Simple Tests', () => {
  describe('constructor', () => {
    it('should create an APIClient instance', () => {
      const client = new APIClient();

      expect(client).toBeInstanceOf(APIClient);
    });

    it('should initialize with default options', () => {
      const client = new APIClient();

      expect(client.host).toBe('0.0.0.0');
      expect(client.contentType).toBe('application/json');
      expect(client.headers).toEqual({ accept: 'application/json' });
    });

    it('should initialize with custom options', () => {
      const client = new APIClient({
        host: 'https://custom.api.com',
        contentType: APIClient.CONTENT_TYPE.FORM_URL_ENCODED,
        headers: { 'x-api-key': 'secret' },
        retryOpts: { retries: 5 },
      });

      expect(client.host).toBe('https://custom.api.com');
      expect(client.contentType).toBe('application/x-www-form-urlencoded');
      expect(client.headers).toEqual({ 'x-api-key': 'secret' });
      expect(client.retryOpts).toEqual({ retries: 5 });
    });

    it('should support payloadSignMethod', () => {
      const signMethod = () => {};
      const client = new APIClient({
        payloadSignMethod: signMethod,
      });

      expect(client.payloadSignMethod).toBe(signMethod);
    });
  });

  describe('Module exports', () => {
    it('should export APIClient', () => {
      expect(APIClient).toBeDefined();
      expect(typeof APIClient).toBe('function');
    });

    it('should export APIResponseError', () => {
      expect(APIResponseError).toBeDefined();
      expect(typeof APIResponseError).toBe('function');
    });

    it('should export NetworkError', () => {
      expect(NetworkError).toBeDefined();
      expect(typeof NetworkError).toBe('function');
    });
  });

  describe('HTTP methods', () => {
    it('should have get method', () => {
      const client = new APIClient();
      expect(typeof client.get).toBe('function');
    });

    it('should have post method', () => {
      const client = new APIClient();
      expect(typeof client.post).toBe('function');
    });

    it('should have patch method', () => {
      const client = new APIClient();
      expect(typeof client.patch).toBe('function');
    });

    it('should have put method', () => {
      const client = new APIClient();
      expect(typeof client.put).toBe('function');
    });

    it('should have del method', () => {
      const client = new APIClient();
      expect(typeof client.del).toBe('function');
    });
  });

  describe('Static properties', () => {
    it('should expose CONTENT_TYPE', () => {
      expect(APIClient.CONTENT_TYPE).toBeDefined();
      expect(APIClient.CONTENT_TYPE.JSON).toBe('application/json');
      expect(APIClient.CONTENT_TYPE.FORM_URL_ENCODED).toBe('application/x-www-form-urlencoded');
    });
  });
});
