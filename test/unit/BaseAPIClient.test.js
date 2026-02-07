import { describe, it, expect, vi, beforeEach } from 'vitest';
const BaseAPIClient = require('../../src/BaseAPIClient');
const APIResponseError = require('../../src/errors/APIResponseError');
const NetworkError = require('../../src/errors/NetworkError');

describe('BaseAPIClient', () => {
  let mockFetch;
  let client;

  beforeEach(() => {
    mockFetch = vi.fn();
    client = new BaseAPIClient({
      host: 'https://api.example.com',
      contentType: BaseAPIClient.CONTENT_TYPE.JSON,
      headers: { accept: 'application/json' },
      fetch: mockFetch,
      retryOpts: { retries: 0 },
    });
  });

  describe('constructor', () => {
    it('should initialize with default options when no opts provided', () => {
      // Test calling with default parameter
      const  freshMockFetch = vi.fn();
      const defaultClient = new BaseAPIClient();

      expect(defaultClient.host).toBe('0.0.0.0');
      expect(defaultClient.contentType).toBe('application/json');
      expect(defaultClient.headers).toEqual({ accept: 'application/json' });
      expect(defaultClient.retryOpts).toEqual({ retries: 0 });
    });

    it('should initialize with custom options', () => {
      const customClient = new BaseAPIClient({
        host: 'https://custom.api.com',
        contentType: BaseAPIClient.CONTENT_TYPE.FORM_URL_ENCODED,
        headers: { 'x-custom': 'header' },
        fetch: mockFetch,
        retryOpts: { retries: 3 },
      });

      expect(customClient.host).toBe('https://custom.api.com');
      expect(customClient.contentType).toBe('application/x-www-form-urlencoded');
      expect(customClient.headers).toEqual({ 'x-custom': 'header' });
      expect(customClient.retryOpts).toEqual({ retries: 3 });
    });

    it('should store payloadSignMethod if provided', () => {
      const signMethod = vi.fn();
      const signClient = new BaseAPIClient({
        fetch: mockFetch,
        payloadSignMethod: signMethod,
      });

      expect(signClient.payloadSignMethod).toBe(signMethod);
    });
  });

  describe('CONTENT_TYPE static property', () => {
    it('should expose JSON content type', () => {
      expect(BaseAPIClient.CONTENT_TYPE.JSON).toBe('application/json');
    });

    it('should expose FORM_URL_ENCODED content type', () => {
      expect(BaseAPIClient.CONTENT_TYPE.FORM_URL_ENCODED).toBe('application/x-www-form-urlencoded');
    });
  });

  describe('HTTP Methods', () => {
    const mockSuccessResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue(JSON.stringify({ success: true })),
    };

    beforeEach(() => {
      mockFetch.mockResolvedValue(mockSuccessResponse);
    });

    describe('get', () => {
      it('should make GET request with correct parameters', async () => {
        await client.get('/users');

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/users',
          expect.objectContaining({
            method: 'GET',
            headers: { accept: 'application/json' },
          })
        );
      });

      it('should support custom headers', async () => {
        await client.get('/users', { 'x-custom': 'value' });

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/users',
          expect.objectContaining({
            method: 'GET',
            headers: { 'x-custom': 'value' },
          })
        );
      });
    });

    describe('post', () => {
      it('should make POST request with JSON body', async () => {
        await client.post('/users', { name: 'John' });

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/users',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'content-type': 'application/json',
            }),
            body: JSON.stringify({ name: 'John' }),
          })
        );
      });

      it('should make POST request without body', async () => {
        await client.post('/users');

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/users',
          expect.objectContaining({
            method: 'POST',
            body: undefined,
          })
        );
      });
    });

    describe('patch', () => {
      it('should make PATCH request with JSON body', async () => {
        await client.patch('/users/1', { name: 'Jane' });

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/users/1',
          expect.objectContaining({
            method: 'PATCH',
            body: JSON.stringify({ name: 'Jane' }),
          })
        );
      });
    });

    describe('put', () => {
      it('should make PUT request with JSON body', async () => {
        await client.put('/users/1', { name: 'Jane', email: 'jane@example.com' });

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/users/1',
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify({ name: 'Jane', email: 'jane@example.com' }),
          })
        );
      });
    });

    describe('del', () => {
      it('should make DELETE request', async () => {
        await client.del('/users/1');

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/users/1',
          expect.objectContaining({
            method: 'DELETE',
          })
        );
      });

      it('should make DELETE request with body', async () => {
        await client.del('/users/1', { reason: 'duplicate' });

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/users/1',
          expect.objectContaining({
            method: 'DELETE',
            body: JSON.stringify({ reason: 'duplicate' }),
          })
        );
      });
    });
  });

  describe('Content-Type handling', () => {
    const mockSuccessResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue(JSON.stringify({ success: true })),
    };

    it('should serialize body as JSON when contentType is JSON', async () => {
      mockFetch.mockResolvedValue(mockSuccessResponse);

      await client.post('/users', { name: 'John', age: 30 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: '{"name":"John","age":30}',
          headers: expect.objectContaining({
            'content-type': 'application/json',
          }),
        })
      );
    });

    it('should serialize body as form-urlencoded when contentType is FORM_URL_ENCODED', async () => {
      const formClient = new BaseAPIClient({
        host: 'https://api.example.com',
        contentType: BaseAPIClient.CONTENT_TYPE.FORM_URL_ENCODED,
        fetch: mockFetch,
        retryOpts: { retries: 0 },
      });

      mockFetch.mockResolvedValue(mockSuccessResponse);

      await formClient.post('/login', { username: 'john', password: 'secret' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: 'username=john&password=secret',
          headers: expect.objectContaining({
            'content-type': 'application/x-www-form-urlencoded',
          }),
        })
      );
    });
  });

  describe('Response handling', () => {
    it('should return parsed JSON response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue('{"data":"value"}'),
      });

      const result = await client.get('/data');

      expect(result).toEqual({ data: 'value' });
    });

    it('should return raw text when response is not JSON', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue('Plain text response'),
      });

      const result = await client.get('/data');

      expect(result).toBe('Plain text response');
    });

    it('should handle empty response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue(''),
      });

      const result = await client.get('/data');

      expect(result).toBe('');
    });
  });

  describe('Error handling', () => {
    it('should throw NetworkError on fetch failure', async () => {
      mockFetch.mockRejectedValue(new Error('Connection refused'));

      await expect(client.get('/users')).rejects.toThrow(NetworkError);
    });

    it('should throw APIResponseError on non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: vi.fn().mockResolvedValue('Resource not found'),
      });

      await expect(client.get('/users/999')).rejects.toThrow(APIResponseError);
    });

    it('should include response details in APIResponseError', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: vi.fn().mockResolvedValue('{"error":"Invalid input"}'),
      });

      try {
        await client.post('/users', {});
      } catch (error) {
        expect(error).toBeInstanceOf(APIResponseError);
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
        expect(error.body).toEqual({ error: 'Invalid input' });
      }
    });
  });

  describe('Payload signing', () => {
    it('should call payloadSignMethod when provided', async () => {
      const signMethod = vi.fn((body) => Promise.resolve(`signed:${body}`));
      const signClient = new BaseAPIClient({
        host: 'https://api.example.com',
        contentType: BaseAPIClient.CONTENT_TYPE.JSON,
        fetch: mockFetch,
        payloadSignMethod: signMethod,
        retryOpts: { retries: 0 },
      });

      mockFetch.mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue('{}'),
      });

      await signClient.post('/users', { name: 'John' });

      expect(signMethod).toHaveBeenCalledWith('{"name":"John"}');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: 'signed:{"name":"John"}',
        })
      );
    });

    it('should not call payloadSignMethod when there is no body', async () => {
      const signMethod = vi.fn();
      const signClient = new BaseAPIClient({
        host: 'https://api.example.com',
        fetch: mockFetch,
        payloadSignMethod: signMethod,
        retryOpts: { retries: 0 },
      });

      mockFetch.mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue('{}'),
      });

      await signClient.get('/users');

      expect(signMethod).not.toHaveBeenCalled();
    });
  });

  describe('Retry configuration', () => {
    it('should pass retryOpts to fetch', async () => {
      const retryClient = new BaseAPIClient({
        host: 'https://api.example.com',
        fetch: mockFetch,
        retryOpts: { retries: 3, retryDelay: 1000 },
      });

      mockFetch.mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue('{}'),
      });

      await retryClient.get('/users');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          retries: 3,
          retryDelay: 1000,
        })
      );
    });
  });
});
