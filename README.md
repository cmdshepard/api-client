# API Client

A robust, class-based API client wrapper designed to be extended and reused across projects.

## Why This Library?

Over more than a decade of building applications, I found myself repeatedly writing the same API client wrapper code for every project. Each time, I needed:

- A class-based structure that could be easily extended
- Automatic retry logic for network resilience
- Proper error handling with distinct error types
- Cross-platform compatibility (Node.js, browser, React Native)
- TypeScript support with proper type inference

After writing this pattern dozens of times, I turned it into a library. Now I never have to write it again, and neither do you.

## Installation

```bash
npm install @cmdshepard/api-client
# or
yarn add @cmdshepard/api-client
```

## Usage

The recommended way to use this library is to **extend the base class** and define your API endpoints as methods. This way, you don't have to write the endpoint path every time you make a request.

### JavaScript Example

```javascript
const { APIClient } = require('@cmdshepard/api-client');

class MyAPI extends APIClient {
  constructor(token) {
    super({
      host: 'https://api.example.com',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      retryOpts: {
        retries: 3,
        retryDelay: 1000
      }
    });
  }

  // Define your endpoints as methods
  getUsers() {
    return this.get('/users');
  }

  getUser(id) {
    return this.get(`/users/${id}`);
  }

  createUser(userData) {
    return this.post('/users', userData);
  }

  updateUser(id, userData) {
    return this.patch(`/users/${id}`, userData);
  }

  deleteUser(id) {
    return this.del(`/users/${id}`);
  }
}

// Usage
const api = new MyAPI('your-token-here');

const users = await api.getUsers();
const user = await api.getUser('123');
const newUser = await api.createUser({ name: 'John Doe' });
```

### TypeScript Example

```typescript
import { APIClient, APIResponseError, NetworkError } from '@cmdshepard/api-client';

interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

class MyAPI extends APIClient {
  constructor(token: string) {
    super({
      host: 'https://api.example.com',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      retryOpts: {
        retries: 3,
        retryDelay: 1000
      }
    });
  }

  // Properly typed responses
  getUsers(): Promise<User[]> {
    return this.get<User[]>('/users');
  }

  getUser(id: string): Promise<User> {
    return this.get<User>(`/users/${id}`);
  }

  createUser(userData: CreateUserRequest): Promise<User> {
    return this.post<User>('/users', userData);
  }

  updateUser(id: string, userData: Partial<User>): Promise<User> {
    return this.patch<User>(`/users/${id}`, userData);
  }

  deleteUser(id: string): Promise<void> {
    return this.del<void>(`/users/${id}`);
  }
}

// Usage with full type safety
const api = new MyAPI('your-token-here');

const users: User[] = await api.getUsers();
const user: User = await api.getUser('123');
```

### React Native Example

React Native has a built-in `fetch` implementation, so you can use `APIClient` directly:

```javascript
import { APIClient } from '@cmdshepard/api-client';

class MyAPI extends APIClient {
  constructor(token) {
    super({
      host: 'https://api.example.com',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
  }

  getUsers() {
    return this.get('/users');
  }
}

// Works in React Native!
const api = new MyAPI('your-token');
const users = await api.getUsers();
```

**Note:** This library uses the native `fetch` API available in Node.js 18+, browsers, and React Native. No polyfills required!

### Direct Usage (Not Recommended)

You can also use `APIClient` directly without extending it, but you'll lose the benefit of predefined endpoints:

```javascript
const { APIClient } = require('@cmdshepard/api-client');

const client = new APIClient({
  host: 'https://api.example.com',
  headers: { 'Authorization': 'Bearer token' }
});

// You have to specify the full path every time
const users = await client.get('/users');
const user = await client.get('/users/123');
```

## Features

- **Class-based & Extensible**: Designed to be extended with your API endpoints
- **Automatic Retries**: Configurable retry logic with exponential backoff
- **Proper Error Handling**: Distinct `NetworkError` and `APIResponseError` types
- **Multiple Content Types**: JSON and form-urlencoded support
- **Custom Headers**: Per-request and per-instance header support
- **Payload Signing**: Optional request body signing
- **Cross-Platform**: Works in Node.js, browsers, and React Native
- **TypeScript Support**: Full type definitions with generic return types

## API Reference

### APIClient

The class you should extend for your API client.

#### Constructor Options

```typescript
new APIClient({
  host?: string;                    // API host URL (default: '0.0.0.0')
  contentType?: string;             // Content-Type header (default: 'application/json')
  headers?: object;                 // Default headers
  payloadSignMethod?: function;     // Optional payload signing function
  retryOpts?: {                     // Retry configuration
    retries?: number;               // Number of retries (default: 0)
    retryDelay?: number | function; // Delay between retries
    retryOn?: number[] | function;  // HTTP status codes to retry on
  };
})
```

#### Methods

All methods support generic return types for TypeScript:

- `get<T>(path: string, headers?: object): Promise<T>`
- `post<T>(path: string, body?: any, headers?: object): Promise<T>`
- `patch<T>(path: string, body?: any, headers?: object): Promise<T>`
- `put<T>(path: string, body?: any, headers?: object): Promise<T>`
- `del<T>(path: string, body?: any, headers?: object): Promise<T>`

### Error Handling

```javascript
const { APIClient, APIResponseError, NetworkError } = require('@cmdshepard/api-client');

class MyAPI extends APIClient {
  // ... your endpoints
}

const api = new MyAPI('token');

try {
  const user = await api.getUser('123');
} catch (error) {
  if (error instanceof APIResponseError) {
    // HTTP error response (4xx, 5xx)
    console.error(`Status: ${error.status}`);
    console.error(`Status Text: ${error.statusText}`);
    console.error(`Response Body:`, error.body);
  } else if (error instanceof NetworkError) {
    // Network-level error (connection failure, timeout, etc.)
    console.error('Network error: Unable to reach the server');
  }
}
```

### Content Types

```javascript
class MyAPI extends APIClient {
  constructor() {
    super({
      host: 'https://api.example.com',
      // Use JSON (default)
      contentType: APIClient.CONTENT_TYPE.JSON,
      // Or use form-urlencoded
      // contentType: APIClient.CONTENT_TYPE.FORM_URL_ENCODED,
    });
  }
}
```

### Payload Signing

```javascript
class MyAPI extends APIClient {
  constructor() {
    super({
      host: 'https://api.example.com',
      payloadSignMethod: async (body) => {
        // Sign the request body
        const signature = await signPayload(body);
        return { ...JSON.parse(body), signature };
      }
    });
  }
}
```

## Development

### Install Dependencies

```bash
yarn install
```

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### Test Coverage

The project maintains 100% test coverage across all source files:

- Unit tests for error classes
- Unit tests for BaseAPIClient
- Unit tests for APIClient
- Integration tests with mock HTTP server

## License

MIT
