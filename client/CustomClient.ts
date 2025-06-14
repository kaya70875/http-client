import * as net from "net";
import { Method, RequestConfig, ResponseT } from "../types/clientTypes";
import { processResponse } from "../utils/processResponse";
import { DefaultConfig } from "../lib/defaults";

export class CustomClient {
  defaults: DefaultConfig;
  constructor(defaultConfig: DefaultConfig) {
    this.defaults = defaultConfig || {};
  }

  private createHeaders(
    customHeaders?: Record<string, string>,
    method: Method = "GET"
  ): string {
    const methodL = method.toLowerCase() as keyof typeof this.defaults.headers;
    const merged = {
      ...this.defaults.headers.common,
      ...this.defaults.headers[methodL],
      ...(customHeaders ?? {}),
    };
    return Object.entries(merged)
      .map(([key, value]) => `${key}: ${value}\r\n`)
      .join("");
  }

  private buildRequest(
    method: string,
    host: string,
    path: string,
    headers: string,
    body?: string | null
  ): string {
    return (
      `${method} ${path} HTTP/1.1\r\n` +
      `Host: ${host}\r\n` +
      headers +
      `Connection: close\r\n` +
      `\r\n` +
      (body ?? "")
    );
  }

  private sendRequest(host: string, request: string): Promise<ResponseT> {
    return new Promise((resolve, reject) => {
      console.log(request);
      const client = net.createConnection(
        { host, port: this.defaults.port },
        () => {
          client.write(request);
        }
      );

      client.setTimeout(16000);
      let response = "";

      client.on("data", (chunk) => {
        response += chunk.toString();
      });

      client.on("end", () => {
        const processed = processResponse(response);
        resolve(processed);
      });

      client.on("timeout", () => {
        client.destroy();
        reject(new Error("Request timed out."));
      });

      client.on("error", (err) => {
        reject(err);
      });
    });
  }

  get(url: string, config?: RequestConfig): Promise<ResponseT> {
    const parsed = new URL(url);
    const headers = this.createHeaders(config?.headers);
    const request = this.buildRequest(
      "GET",
      parsed.host,
      parsed.pathname + parsed.search,
      headers
    );
    return this.sendRequest(parsed.host, request);
  }

  post(url: string, config: RequestConfig): Promise<ResponseT> {
    const parsed = new URL(url);
    const body = config.body ? JSON.stringify(config.body) : "";
    const headers = this.createHeaders(
      {
        ...config?.headers,
      },
      "POST"
    );
    const request = this.buildRequest(
      "POST",
      parsed.host,
      parsed.pathname + parsed.search,
      headers,
      body
    );
    return this.sendRequest(parsed.host, request);
  }
}
