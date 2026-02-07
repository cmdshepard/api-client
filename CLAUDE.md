# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@cmdshepard/api-client` is a lightweight, robust base class for building API client abstractions in Node.js. It provides HTTP method wrappers (GET, POST, PATCH, PUT, DELETE) with built-in retry logic, error handling, and payload signing capabilities.

## Architecture

### Class Structure

The library uses a single-class architecture:

**APIClient** (`src/APIClient.js`) - Main implementation containing:
- HTTP method implementations (get, post, patch, put, del)
- Request handling logic in `_request()` method
- Content-type handling (JSON and form-urlencoded)
- Retry logic via fetch-retry wrapper
- Error classification (NetworkError vs APIResponseError)
- Optional payload signing via `payloadSignMethod` callback
- Uses native `fetch` API (available in Node.js 20+, browsers, and React Native)

The library requires Node.js 20+ which includes native fetch support, eliminating the need for polyfills.

### Error Handling

Two custom error classes handle different failure modes:

- **NetworkError** (`src/errors/NetworkError.js`) - Thrown for network-level failures (connection errors, timeouts, etc.)
- **APIResponseError** (`src/errors/APIResponseError.js`) - Thrown for non-OK HTTP responses, includes:
  - `status`: HTTP status code
  - `statusText`: Status text
  - `body`: Parsed response body (JSON if possible, raw text otherwise)

### Content Type Support

The client supports two content types via `APIClient.CONTENT_TYPE`:
- `JSON`: Serializes body as JSON string
- `FORM_URL_ENCODED`: Serializes body as URLSearchParams

### Key Features

- **Retry Logic**: Configurable via `retryOpts` (uses fetch-retry under the hood)
- **Payload Signing**: Optional `payloadSignMethod` callback for signing request bodies before sending
- **Flexible Headers**: Per-request header overrides supported on all methods
- **Response Parsing**: Automatically attempts JSON parsing, falls back to text

## Development Commands

This is a library package with no build step. The package uses:
- **Package Manager**: Yarn 4.12.0 (see `packageManager` field in package.json)
- **Node Version**: >=20.0.0 (requires native fetch API support)

To install dependencies:
```
yarn install
```

## Publishing

The package is published to npm as `@cmdshepard/api-client`. Version updates follow semantic versioning and are tracked via git tags.

## Type Definitions

TypeScript definitions are maintained in `types.d.ts` at the project root. When modifying the API surface, ensure type definitions are updated accordingly.
