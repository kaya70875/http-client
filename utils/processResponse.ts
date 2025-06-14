import { ResponseT } from "../types/clientTypes";

export function processResponse(raw: string): ResponseT {
  try {
    const [headerPart, dataSegment] = raw.split("\r\n\r\n");

    const headerLines = headerPart.split("\r\n");
    const statusLine = headerLines[0]; // HTTP/1.1 200 OK

    const [_, statusCode, statusMessage] =
      statusLine.match(/HTTP\/\d\.\d (\d{3}) (.*)/) || [];

    const headers: Record<string, string> = {};
    for (let i = 1; i < headerLines.length; i++) {
      const [key, ...rest] = headerLines[i].split(":");
      headers[key.trim()] = rest.join(":").trim();
    }

    console.log("data", dataSegment);
    const data = JSON.parse(dataSegment);

    return {
      statusCode: Number(statusCode),
      statusMessage,
      headers,
      data,
    };
  } catch (err) {
    return {
      statusCode: Number(500),
      statusMessage: `error while processing raw data: ${err}`,
      headers: {},
      data: null,
    };
  }
}
