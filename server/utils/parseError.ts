import { APIError } from "@shared/types/api";

export const parseError = (err: Error): APIError =>
  JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
