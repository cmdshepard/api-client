declare enum CONTENT_TYPE {
  JSON = 'application/json',
  FORM_URL_ENCODED = 'application/x-www-form-urlencoded',
}

declare type headers = {
  [key: string]: string
};

export default class APIClient {
  public static CONTENT_TYPE: CONTENT_TYPE;

  constructor(initOpts: {
    host?: string;
    contentType?: CONTENT_TYPE;
    headers?: headers;
    payloadSignMethod?: (body: any) => any;
  });

  public get(path: string, headers?: headers);

  public post(path: string, body?: any, headers?: headers);

  public patch(path: string, body?: any, headers?: headers);

  public put(path: string, body?: any, headers?: headers);

  public del(path: string, body?: any, headers?: headers);
}
