import { TrinoQueryParams, Trino, TrinoResponse } from '../src'
import axios from 'axios'

describe('Trino Test', () => {
  let requestParams: TrinoQueryParams
  let trino: Trino
  let trinoFake: any
  let trinoResponse: TrinoResponse
  
  beforeEach(() => {
    requestParams = {
      query: 'SELECT * FROM pedidos',
      catalog: 'mysqldb',
      schema: 'clientes',
      source: 'test-trino',
      user: 'root',
      isHttps: false,
      host: 'localhost',
      port: 8080,
      checkStatusInterval: 1000,
      updatesNotification: (log) => (log),
      errorNotification: (error) => (error)
    }
    trino = new Trino(requestParams)
    trinoFake = Object.getPrototypeOf(trino)
    trinoResponse = {
      id: '20201010_028028208_xxx',
      infoUri: 'http://20201010_028028208_xxx',
      nextUri: 'http://20201010_028028208_xxx',
      data: [[]],
    }
  })

  it('Should Return Axios Instance', async () => {
    const axiosInstance = axios.create()
    const spyTrino = jest.spyOn(trinoFake, 'request').mockImplementation().mockResolvedValue(axiosInstance)
    const resultTrino = await trinoFake.request()
    expect(spyTrino).toHaveBeenCalled()
    expect(resultTrino).toBe(axiosInstance)
  })

  it('Should Return Trino Response', async () => {
    jest.spyOn(trino, 'go').mockImplementation().mockResolvedValue(trinoResponse)
    const resultTrino = await trino.go()
    expect(resultTrino).toHaveProperty('id')
    expect(resultTrino).toHaveProperty('infoUri')
    expect(resultTrino).toHaveProperty('nextUri')
    expect(resultTrino).toHaveProperty('data')
  })


  it('Should check sendToTrino', async () => {
    const spyTrino = jest.spyOn(trinoFake, 'sendToTrino').mockResolvedValue(trinoResponse)
    const resultTrino = await trinoFake.sendToTrino('URL', 'POST')
    expect(spyTrino).toHaveBeenCalled()
    expect(resultTrino).toHaveProperty('id')
    expect(resultTrino).toHaveProperty('infoUri')
    expect(resultTrino).toHaveProperty('nextUri')
    expect(resultTrino).toHaveProperty('data')
  })

  it('Should reject with error', async () => {
    const resultTrino = jest.spyOn(trino, 'go').mockImplementation(() => {
      throw new Error('erro_trino')
    })
    expect(resultTrino).toThrowError(new Error('erro_trino'))
  })
})