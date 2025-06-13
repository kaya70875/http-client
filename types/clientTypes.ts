export interface RequestConfig {
  headers?: Record<string, string>;
  body?: string | null;
}

export interface ResponseT {
  statusCode: number;
  statusMessage: string;
  data: any;
}
