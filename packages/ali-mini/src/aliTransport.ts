import { ToStringTypes } from '@mitojs/shared'
import { toStringValidateOption, _support } from '@mitojs/utils'
import { ReportDataType } from '@mitojs/types'
import { BaseTransport } from '@mitojs/core'
import { AliOptionsFieldsTypes } from './types'

export class AliTransport extends BaseTransport<AliOptionsFieldsTypes> {
  configReportWxRequest: unknown
  useImgUpload = false
  constructor(options: Partial<AliOptionsFieldsTypes> = {}) {
    super()
    super.bindOptions(options)
    this.bindOptions(options)
  }
  post(data: any, url: string) {
    const requestFun = (): void => {
      let requestOptions = { method: 'POST' } as WechatMiniprogram.RequestOption
      if (typeof this.configReportWxRequest === 'function') {
        const params = this.configReportWxRequest(data)
        // default method
        requestOptions = { ...requestOptions, ...params }
      }
      requestOptions = {
        ...requestOptions,
        data: JSON.stringify(data),
        url
      }
      my.request(requestOptions as any)
    }
    this.queue.addTask(requestFun)
  }
  sendToServer(data: any, url: string) {
    return this.post(data, url)
  }
  getTransportData(data: ReportDataType) {
    return {
      authInfo: this.getAuthInfo(),
      data,
      deviceInfo: _support.deviceInfo
    }
  }
  bindOptions(options: AliOptionsFieldsTypes = {}) {
    const { configReportWxRequest } = options
    toStringValidateOption(configReportWxRequest, 'configReportWxRequest', ToStringTypes.Function) &&
      (this.configReportWxRequest = configReportWxRequest)
  }
}
