# Trino TS

trino-ts é uma biblioteca desenvolvida para JavaScript/TypeScript que permite a interação e execução de queries na ferramenta de consulta em Big Data Trino (anteriormente conhecida como Presto).


## Instalação

Para começar a usar a biblioteca, basta adicionar a dependência ao seu projeto utilizando seu gerenciador de dependências favorito.
```bash
npm install --save trino-ts
```

ou 

```bash
yarn add trino-ts
```


## Exemplo de Implementação
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