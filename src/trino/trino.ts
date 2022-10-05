import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { TrinoQueryParams } from './interfaces/trino.query.params'
import { TrinoHeaders } from './interfaces/trino.headers'
import { TrinoResponse } from './interfaces/trino.response'
import { TRINO_STATEMENT_PATH, TRINO_HTTP_METHODS } from './trino.contants'
import { TrinoStatus } from './interfaces/trino.status'
import * as http from 'http'
import * as https from 'https'

export class Trino {
  constructor(
    private readonly params: TrinoQueryParams, 
    private readonly httpAgentOptions?: http.AgentOptions
  ) { }

  private _querystatus: TrinoStatus

  public get querystatus(): TrinoStatus {
    return this._querystatus
  }
  public set querystatus(value: TrinoStatus) {
    this._querystatus = value
  }

  private async request(): Promise<AxiosInstance> {
    try {
      let basicAuthParam: string
      if (this.params.isBasicAuth) {
        basicAuthParam = 'Basic ' + Buffer.from(this.params.user + ':' + this.params.password).toString('base64')
      }
      const protocol = this.params.isHttps ? 'https' : 'http'
      return axios.create({
        baseURL: `${protocol}://${this.params.host}:${this.params.port}`,
        headers: {
          [TrinoHeaders.USER]: this.params.user,
          [TrinoHeaders.CATALOG]: this.params.catalog,
          [TrinoHeaders.SCHEMA]: this.params.schema,
          [TrinoHeaders.SOURCE]: this.params.source,
          [TrinoHeaders.USER_AGENT]: this.params.source,
          [TrinoHeaders.AUTHORIZATION]: basicAuthParam
        },
        httpAgent: new http.Agent(this.httpAgentOptions || {}),
        httpsAgent: new https.Agent(this.httpAgentOptions || {})
      })
    } catch (error) {
      this.params.errorNotification(error)
      throw new Error(error)
    }
  }

  public async go(): Promise<TrinoResponse> {
    try {
      return await this.sendToTrino(TRINO_STATEMENT_PATH, TRINO_HTTP_METHODS.POST)
    } catch (error) {
      this.params.errorNotification(error)
      throw new Error(error)
    }
  }

  private async sendToTrino(url: string, method: AxiosRequestConfig['method']): Promise<TrinoResponse> {
    try {
      const request = await this.request()
      let resultTrino: TrinoResponse
      const isFirstRequest: boolean = (method === TRINO_HTTP_METHODS.POST)
      resultTrino = isFirstRequest
        ? await (await request({ url, method, data: this.params.query })).data
        : await (await request({ url, method })).data
      return await this.handleTrinoResponse(resultTrino)
    } catch (error) {
      this.params.errorNotification(error)
      throw new Error(error)
    }
  }

  private async handleTrinoResponse(resultTrino: TrinoResponse): Promise<TrinoResponse> {
    try {
      this.params.updatesNotification(resultTrino)
      if (resultTrino.stats.state !== TrinoStatus.FINISHED && resultTrino.nextUri) {
        this.insertInTheQueue(resultTrino.nextUri)
      } else if (resultTrino.stats.state === TrinoStatus.FINISHED) {
        this._querystatus = TrinoStatus.FINISHED
        return resultTrino
      }
    } catch (error) {
      this.params.errorNotification(error)
      throw new Error(error)
    }
  }

  private async insertInTheQueue(nextUri: string): Promise<void> {
    try {
      setTimeout(async () => {
        return await this.sendToTrino(nextUri, TRINO_HTTP_METHODS.GET)
      }, this.params.checkStatusInterval)
    } catch (error) {
      this.params.errorNotification(error)
      throw new Error(error)
    }
  }
}