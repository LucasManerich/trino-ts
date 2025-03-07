# Trino TS

trino-ts is a lib for JavaScript/TypeScript that allows the interaction and execution of queries in Trino (formerly known as Presto).


## Installation

Add the dependency to your project using your favorite dependency manager.

```bash
npm install --save trino-ts
```

or 

```bash
yarn add trino-ts
```


## Example
```typescript
import { Trino, TrinoQueryParams, TrinoResponse } from  'trino-ts';

const updatesNotification = (response: TrinoResponse) => {
  console.log(response)
}

const errorNotification = (error: Error) => {
  console.error(error)
}

const trinoInstance = new Trino({
  catalog: 'bigdata_catalog',
  schema: 'bigdata_schema',
  user: 'root',
  password: 'any_password',
  host: '127.0.0.1',
  port: '8080',
  source: 'NodeJS Trino Connector',
  checkStatusInterval: 1000, //1s
  isBasicAuth: true,
  isHttps: false,
  query: 'SELECT * FROM tbcliente',
  errorNotification,
  updatesNotification
})
trinoInstance.go()
```