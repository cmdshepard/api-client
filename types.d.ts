import type { RequestInitRetryParams } from 'fetch-retry';

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
    retryOpts?: RequestInitRetryParams<typeof fetch>;
  });

  public get(path: string, headers?: headers): Promise<any>;

  public post(path: string, body?: any, headers?: headers): Promise<any>;

  public patch(path: string, body?: any, headers?: headers): Promise<any>;

  public put(path: string, body?: any, headers?: headers): Promise<any>;

  public del(path: string, body?: any, headers?: headers): Promise<any>;
}

export class APIResponseError extends Error {
  public status: number;
  public statusText: string;
  public body: any;
}

export class NetworkError extends Error {}
