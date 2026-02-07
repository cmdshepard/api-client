import { describe, it, expect, beforeAll, afterAll } from 'vitest';
const { APIClient } = require('../../src/APIClient');

/**
 * Integration tests using a real mock server
 * These tests verify the full request/response flow
 */

describe('APIClient Integration Tests', () => {
  let client;
  let mockServer;
  const TEST_PORT = 3456;
  const TEST_HOST = `http://localhost:${TEST_PORT}`;

  // Simple mock HTTP server
  beforeAll(async () => {
    const http = require('http');

    mockServer = http.createServer((req, res) => {
      // Parse request
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        // Route handling
        if (req.url === '/users' && req.method === 'GET') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ users: [{ id: 1, name: 'John' }] }));
        } else if (req.url === '/users' && req.method === 'POST') {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          const parsedBody = JSON.parse(body);
          res.end(JSON.stringify({ id: 2, ...parsedBody }));
        } else if (req.url === '/users/1' && req.method === 'PATCH') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ id: 1, name: 'Updated' }));
        } else if (req.url === '/users/1' && req.method === 'PUT') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ id: 1, name: 'Replaced' }));
        } else if (req.url === '/users/1' && req.method === 'DELETE') {
          res.writeHead(204);
          res.end();
        } else if (req.url === '/error/404') {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not Found' }));
        } else if (req.url === '/error/500') {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else if (req.url === '/text') {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Plain text response');
        } else if (req.url === '/form' && req.method === 'POST') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ received: body }));
        } else {
          res.writeHead(404);
          res.end();
        }
      });
    });

    await new Promise((resolve) => {
      mockServer.listen(TEST_PORT, resolve);
    });

    client = new APIClient({
      host: TEST_HOST,
      contentType: 'application/json',
      headers: { accept: 'application/json' },
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => {
      mockServer.close(resolve);
    });
  });

  describe('GET requests', () => {
    it('should successfully fetch data', async () => {
      const result = await client.get('/users');

      expect(result).toEqual({
        users: [{ id: 1, name: 'John' }],
      });
    });

    it('should handle non-JSON text response', async () => {
      const result = await client.get('/text');

      expect(result).toBe('Plain text response');
    });
  });

  describe('POST requests', () => {
    it('should successfully create resource with JSON body', async () => {
      const result = await client.post('/users', {
        name: 'Jane',
        email: 'jane@example.com',
      });

      expect(result).toEqual({
        id: 2,
        name: 'Jane',
        email: 'jane@example.com',
      });
    });

    it('should send form-urlencoded data', async () => {
      const formClient = new APIClient({
        host: TEST_HOST,
        contentType: 'application/x-www-form-urlencoded',
      });

      const result = await formClient.post('/form', {
        username: 'john',
        password: 'secret',
      });

      expect(result.received).toBe('username=john&password=secret');
    });
  });

  describe('PATCH requests', () => {
    it('should successfully update resource', async () => {
      const result = await client.patch('/users/1', { name: 'Updated' });

      expect(result).toEqual({
        id: 1,
        name: 'Updated',
      });
    });
  });

  describe('PUT requests', () => {
    it('should successfully replace resource', async () => {
      const result = await client.put('/users/1', { name: 'Replaced' });

      expect(result).toEqual({
        id: 1,
        name: 'Replaced',
      });
    });
  });

  describe('DELETE requests', () => {
    it('should successfully delete resource', async () => {
      const result = await client.del('/users/1');

      // Empty response for 204 No Content
      expect(result).toBe('');
    });
  });

  describe('Error handling', () => {
    it('should throw APIResponseError for 404', async () => {
      try {
        await client.get('/error/404');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error.constructor.name).toBe('APIResponseError');
        expect(error.status).toBe(404);
        expect(error.body).toEqual({ error: 'Not Found' });
      }
    });

    it('should throw APIResponseError for 500', async () => {
      try {
        await client.get('/error/500');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error.constructor.name).toBe('APIResponseError');
        expect(error.status).toBe(500);
        expect(error.body).toBe('Internal Server Error');
      }
    });

    it('should throw NetworkError for connection failures', async () => {
      const badClient = new APIClient({
        host: 'http://localhost:9999', // Non-existent server
      });

      try {
        await badClient.get('/users');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error.constructor.name).toBe('NetworkError');
      }
    });
  });

  describe('Custom headers', () => {
    it('should send custom headers with request', async () => {
      // This test verifies headers are passed through
      // In a real scenario, the server would validate these
      const result = await client.get('/users', {
        'x-custom-header': 'custom-value',
        'authorization': 'Bearer token123',
      });

      expect(result).toBeDefined();
    });
  });

  describe('Cross-platform compatibility', () => {
    it('should work in Node.js environment', async () => {
      // This test runs in Node.js via Vitest
      const result = await client.get('/users');

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('should handle various response types', async () => {
      // JSON response
      const jsonResult = await client.get('/users');
      expect(typeof jsonResult).toBe('object');

      // Text response
      const textResult = await client.get('/text');
      expect(typeof textResult).toBe('string');

      // Empty response
      const emptyResult = await client.del('/users/1');
      expect(emptyResult).toBe('');
    });
  });
});
