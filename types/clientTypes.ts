export interface RequestConfig {
  headers?: Record<string, string>;
  body?: string | null;
}

export interface ResponseT {
  statusCode: number;
  statusMessage: string;
  headers: Record<string, string>;
  data: any;
}

export type Method = "GET" | "POST" | "PUT" | "DELETE";
