import { BaseOptionsFieldsIntegrationType, IAnyObject, TransportDataType } from '@mitojs/types'
import "@mini-types/alipay"

export interface AliRouteCollectType {
  from: string
  to: string
  isFail?: boolean
  message?: string
}

export interface AliOptionsFieldsTypes extends AliSilentOptionsType, AliHookOptionsType, BaseOptionsFieldsIntegrationType {}

export type IAliPageInstance = MiniProgram.Page.IInstance<object, {}, {}>

export interface AliSilentOptionsType {
  /**
   * 静默监控wx.request事件
   */
  silentRequest?: boolean
  /**
   * 静默监控wx.console事件
   */
  silentConsole?: boolean
  /**
   * 静默监控Dom事件
   */
  silentDom?: boolean
  /**
   * 静默监控Route切换事件
   */
  silentRoute?: boolean
  /**
   * 静默监控error事件
   */
  silentAppOnError?: boolean
  /**
   * 静默监控unhandledrejection事件
   */
  silentAppOnUnhandledRejection?: boolean
  /**
   * 静默监控onPageNotFound事件
   */
  silentAppOnPageNotFound?: boolean

  /**
   * 静默监控OnShareAppMessage事件
   */
  silentPageOnShareAppMessage?: boolean
  /**
   * 静默监控OnShareTimeline事件
   */
  silentPageOnShareTimeline?: boolean

  // silentAppOnLaunch?: boolean

  // slientAppOnShow?: boolean

  // slientAppOnHide?: boolean
}

export interface AliHookOptionsType {
  /**
   * 配置wx小程序上报时的wx.request配置
   *
   * @param {(TransportDataType | any)} event 即将上报的数据
   * @return {*}  {Partial<WechatMiniprogram.RequestOption>}
   * @memberof AliHookOptionsType
   */
  configReportWxRequest?(event: TransportDataType | any): Partial<WechatMiniprogram.RequestOption>
  /**
   * 钩子函数：wx小程序的App下的onLaunch执行完后再执行以下hook
   *
   * @param {WechatMiniprogram.App.LaunchShowOption} options
   * @memberof AliHookOptionsType
   */
  appOnLaunch?(options: WechatMiniprogram.App.LaunchShowOption): void
  /**
   * 钩子函数：wx小程序的App下的OnShow执行完后再执行以下hook
   *
   * @param {WechatMiniprogram.App.LaunchShowOption} options
   * @memberof AliHookOptionsType
   */
  appOnShow?(options: WechatMiniprogram.App.LaunchShowOption): void
  /**
   * 钩子函数：wx小程序的App下的OnHide执行完后再执行以下hook
   *
   * @memberof AliHookOptionsType
   */
  appOnHide?(): void
  /**
   * 钩子函数：wx小程序的App下的onPageNotFound执行完后再执行以下hook
   *
   * @param {WechatMiniprogram.OnPageNotFoundCallbackResult} data
   * @memberof AliHookOptionsType
   */
  appOnPageNotFound?(data: WechatMiniprogram.OnPageNotFoundCallbackResult): void
  /**
   * 钩子函数：先执行hook:pageOnLoad再执行wx小程序的Page下的onShow
   *
   * @param {IAliPageInstance} page
   * @memberof AliHookOptionsType
   */
  pageOnLoad?(page: IAliPageInstance): void
  /**
   * 钩子函数：先执行hook:pageOnShow再执行wx小程序的Page下的onShow
   *
   * @param {IAliPageInstance} page
   * @memberof AliHookOptionsType
   */
  pageOnShow?(page: IAliPageInstance): void
  /**
   * 钩子函数：先执行hook:pageOnReady再执行wx小程序的Page下的onShow
   *
   * @param {IAliPageInstance} page
   * @memberof AliHookOptionsType
   */
  pageOnReady?(page: IAliPageInstance): void
  /**
   *  钩子函数：先wx小程序的App下的pageOnUnload执行完后再执行以下hook
   *
   * @param {IAliPageInstance} page
   * @memberof AliHookOptionsType
   */
  pageOnUnload?(page: IAliPageInstance): void
  /**
   * 钩子函数：先执行hook:pageOnHide再执行wx小程序的Page下的onHide
   *
   * @param {IAliPageInstance} page
   * @memberof AliHookOptionsType
   */
  pageOnHide?(page: IAliPageInstance): void
  /**
   * 先执行hook:onShareAppMessage再执行wx小程序的Page下的onShareAppMessage
   *
   * @param {(WechatMiniprogram.Page.IShareAppMessageOption & IAliPageInstance)} options
   * @memberof AliHookOptionsType
   */
  pageOnShareAppMessage?(options: WechatMiniprogram.Page.IShareAppMessageOption & IAliPageInstance): void
  /**
   * 先执行hook:onShareTimeline再执行wx小程序的Page下的onShareTimeline
   *
   * @param {IAliPageInstance} page
   * @memberof AliHookOptionsType
   */
  pageOnShareTimeline?(page: IAliPageInstance): void
  /**
   * 先执行hook:onTabItemTap再执行wx小程序的Page下的onTabItemTap
   *
   * @param {(WechatMiniprogram.Page.ITabItemTapOption & IAliPageInstance)} options
   * @memberof AliHookOptionsType
   */
  pageOnTabItemTap?(options: WechatMiniprogram.Page.ITabItemTapOption & IAliPageInstance): void
  /**
   * 钩子函数：重写wx.NavigateToMiniProgram将里面的参数抛出来，便于在跳转时更改query和extraData
   *
   * @param {WechatMiniprogram.NavigateToMiniProgramOption} options
   * @return {*}  {WechatMiniprogram.NavigateToMiniProgramOption}
   * @memberof AliHookOptionsType
   */
  wxNavigateToMiniProgram?(options: WechatMiniprogram.NavigateToMiniProgramOption): WechatMiniprogram.NavigateToMiniProgramOption
  /**
   * 钩子函数：代理Action中所有函数，拿到第一个参数并抛出
   *
   * 可用来判断e.target.type是否等于tap
   *
   * @param {WechatMiniprogram.BaseEvent} e 拿到事件e
   * @memberof AliHookOptionsType
   */
  triggerWxEvent?(e: WechatMiniprogram.BaseEvent): void
}

export interface WxLifeCycleBreadcrumb {
  path: string
  query: IAnyObject
  //  是否需要更多的属性
  // referrerInfo: IAnyObject
  // scene: number
  // shareTicket: any
}
export interface WxOnShareAppMessageBreadcrumb extends WxLifeCycleBreadcrumb {
  options: WechatMiniprogram.Page.IShareAppMessageOption
}

export interface WxOnTabItemTapBreadcrumb extends WxLifeCycleBreadcrumb {
  options: WechatMiniprogram.Page.ITabItemTapOption
}

export interface WxRequestErrorBreadcrumb {
  requestOptions: WechatMiniprogram.RequestOption
  errMsg: string
}
