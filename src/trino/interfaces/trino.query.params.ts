import { TrinoResponse } from "./trino.response";

export interface TrinoQueryParams {
  query: string,
  catalog: string,
  schema: string,
  source: string,
  user: string,
  password?: string,
  isBasicAuth?: boolean,
  host: string,
  port: number,
  isHttps: boolean,
  checkStatusInterval: number,
  updatesNotification: (data: TrinoResponse) => any,
  errorNotification: (data: Error) => any,
}
