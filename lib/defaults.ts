export const defaults = {
  headers: {
    common: {
      Accept: "application/json",
    },
    get: {
      "Content-Type": "application/json",
    },
    post: {
      "Content-Type": "application/json",
      "X-Testing": "test/value",
    },
  },
  port: 80,
  timeout: 24000,
};

export interface DefaultConfig {
  headers: {
    common: Record<string, string>;
    get: Record<string, string>;
    post: Record<string, string>;
  };
  port: number;
  timeout: number;
}
