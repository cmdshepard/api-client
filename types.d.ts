import type { RequestInitWithRetry } from 'fetch-retry';

declare type headers = {
  [key: string]: string
};

export class APIClient {
  public static CONTENT_TYPE: {
    JSON: 'application/json',
    FORM_URL_ENCODED: 'application/x-www-form-urlencoded',
  };

  constructor(initOpts?: {
    host?: string;
    contentType?: 'application/json' | 'application/x-www-form-urlencoded';
    headers?: headers;
    payloadSignMethod?: (body: any) => any;
    retryOpts?: RequestInitWithRetry;
  });

  public get(path: string, headers?: headers);

  public post(path: string, body?: any, headers?: headers);

  public patch(path: string, body?: any, headers?: headers);

  public put(path: string, body?: any, headers?: headers);

  public del(path: string, body?: any, headers?: headers);
}

export class APIResponseError extends Error {
  public status: number;
  public statusText: string;
  public body: any;
}

export class NetworkError extends Error {}
