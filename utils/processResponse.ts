import { ResponseT } from "../types/clientTypes";

export function processResponse(raw: string): ResponseT {
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

  // Make sure data is valid response and not an html response.
  // We can also parse html response instead of doing this.
  let data = "{}";
  data == "" ? dataSegment.includes("<html>") : dataSegment;

  console.log("data", dataSegment);
  data = JSON.parse(data);

  return {
    statusCode: Number(statusCode),
    statusMessage,
    headers,
    data,
  };
}

export function processChunkedResponse(chunkedBody: string): string {
  let result = "";
  let i = 0;

  while (i < chunkedBody.length) {
    const crlfIndex = chunkedBody.indexOf("\r\n", i);
    if (crlfIndex === -1) break;

    const chunkSizeHex = chunkedBody.slice(i, crlfIndex).trim();
    const chunkSize = parseInt(chunkSizeHex, 16);

    if (isNaN(chunkSize) || chunkSize === 0) break;

    const chunkStart = crlfIndex + 2;
    const chunkEnd = chunkStart + chunkSize;
    result += chunkedBody.slice(chunkStart, chunkEnd);

    i = chunkEnd + 2; // skip \r\n after chunk data
  }

  return result;
}
