import * as net from "net";
import { RequestConfig, ResponseT } from "../types/clientTypes";
import { processResponse } from "../utils/processResponse";

export class CustomClient {
  port: number;
  defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  constructor(port: number = 80) {
    this.port = port;
  }

  get(url: string, config?: RequestConfig): Promise<ResponseT> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const host = parsedUrl.host;
      const path = parsedUrl.pathname + parsedUrl.search;

      const mergedHeaders = {
        ...this.defaultHeaders,
        ...(config?.headers ?? {}),
      };

      const headerString = Object.entries(mergedHeaders)
        .map(([key, value]) => `${key}: ${value}\r\n`)
        .join("");

      console.log(headerString);

      const client = net.createConnection({ host, port: this.port }, () => {
        const request =
          `GET ${path} HTTP/1.1\r\n` +
          `Host: ${host}\r\n` +
          headerString +
          `Connection: close\r\n` +
          `\r\n`;

        client.write(request);
      });

      // Set timeout for request.
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

  post(url: string, config: RequestConfig) {
    // Can be implemented later
  }
}
