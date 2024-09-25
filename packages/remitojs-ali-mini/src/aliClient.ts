import { Breadcrumb, BaseClient } from 'remitojs-core'
import { ErrorTypes, EventTypes, MitoLog, MitoLogEmptyMsg, MitoLogEmptyTag, Silent, WxBreadcrumbTypes, WxEventTypes } from 'remitojs-shared'
import { extractErrorStack, firstStrtoUppercase, getCurrentRoute, getTimestamp, isError, Severity, unknownToString } from 'remitojs-utils'
import { LogTypes, TrackReportDataType } from 'remitojs-types'
import { AliOptions } from './aliOptions'
import { AliTransport } from './aliTransport'
import { WxOptionsFieldsTypes } from './types'
import { addBreadcrumbInWx } from './utils'

export class AliClient extends BaseClient<WxOptionsFieldsTypes, EventTypes> {
  transport: AliTransport
  options: AliOptions
  breadcrumb: Breadcrumb<WxOptionsFieldsTypes>
  constructor(options: WxOptionsFieldsTypes = {}) {
    super(options)
    this.options = new AliOptions(options)
    this.transport = new AliTransport(options)
    this.breadcrumb = new Breadcrumb(options)
  }

  /**
   * 判断当前插件是否启用，用于wx的option
   *
   * @param {WxEventTypes} name
   * @return {*}  {boolean}
   * @memberof WxClient
   */
  isPluginEnable(name: WxEventTypes): boolean {
    const silentField = `${Silent}${firstStrtoUppercase(name)}`
    return !this.options[silentField]
  }
  log(data: LogTypes) {
    const { message = MitoLogEmptyMsg, tag = MitoLogEmptyTag, level = Severity.Critical, ex = '' } = data
    let errorInfo = {}
    if (isError(ex)) {
      errorInfo = extractErrorStack(ex, level)
    }
    const reportData = {
      type: ErrorTypes.LOG,
      level,
      message: unknownToString(message),
      name: MitoLog,
      customTag: unknownToString(tag),
      time: getTimestamp(),
      url: getCurrentRoute(),
      ...errorInfo
    }
    const breadcrumbStack = addBreadcrumbInWx.call(this, message, WxBreadcrumbTypes.CUSTOMER, Severity.fromString(level.toString()))
    this.transport.send(reportData, breadcrumbStack)
  }

  /**
   * 埋点信息发送
   *
   * @param {TrackReportDataType} trackData
   * @memberof WxClient
   */
  trackSend(trackData: TrackReportDataType): void {
    this.transport.send(
      {
        isTrack: true,
        ...trackData
      },
      this.breadcrumb.getStack()
    )
  }
}
