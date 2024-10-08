import { LinstenerTypes, WxBaseEventTypes, WxBreadcrumbTypes } from '@mitojs/shared'
import { BasePluginType } from '@mitojs/remitojs-types'
import { isEmptyObject, replaceOld, throttle } from '@mitojs/remitojs-utils'
import { addBreadcrumbInWx, targetAsString } from '../utils'
import { WxClient } from '../wxClient'
import { invokeCallbackInReplaceComponent, invokeCallbackInReplacePage } from './wxPage'

const wxDomPlugin: BasePluginType<WxBaseEventTypes, WxClient> = {
  name: WxBaseEventTypes.DOM,
  monitor(notify) {
    const { options: sdkOptions } = this
    function monitorDomWithOption(
      options:
        | WechatMiniprogram.Page.Options<WechatMiniprogram.Page.DataOption, WechatMiniprogram.Page.CustomOption>
        | WechatMiniprogram.Component.MethodOption
    ) {
      function gestureTrigger(e) {
        e.mitoWorked = true // 给事件对象增加特殊的标记，避免被无限透传
        notify(WxBaseEventTypes.DOM, e)
      }
      const throttleGesturetrigger = throttle(gestureTrigger, sdkOptions.throttleDelayTime)
      const linstenerTypes = [LinstenerTypes.Touchmove, LinstenerTypes.Tap]
      if (options) {
        Object.keys(options).forEach((m) => {
          if ('function' !== typeof options[m]) {
            return
          }
          replaceOld(
            options,
            m,
            function (originMethod: (args: any) => void) {
              return function (...args: any): void {
                // 兼容 uni app 3：start
                if (this.$vm && !this.$vm._mito_hook_) {
                  // eslint-disable-next-line @typescript-eslint/no-this-alias
                  const that = this
                  if (!that._mito_hook_) {
                    that._mito_hook_ = true
                    Object.keys(that).forEach(function (vmk) {
                      // $ 开头不重写，不是 tap 函数
                      if (~vmk.indexOf('$') || typeof that[vmk] !== 'function') return
                      const original = that[vmk]
                      that[vmk] = function () {
                        // eslint-disable-next-line prefer-rest-params
                        const e = arguments[0]
                        if (e && e.type && e.currentTarget && !e.mitoWorked) {
                          sdkOptions.triggerWxEvent(e)
                          if (linstenerTypes.indexOf(e.type) > -1) {
                            throttleGesturetrigger(e)
                          }
                        }
                        // eslint-disable-next-line prefer-rest-params
                        return original.apply(this, arguments)
                      }
                    })
                  }
                }
                // end
                const e = args[0]
                if (e && e.type && e.currentTarget && !e.mitoWorked) {
                  sdkOptions.triggerWxEvent(e)
                  if (linstenerTypes.indexOf(e.type) > -1) {
                    throttleGesturetrigger(e)
                  }
                }
                return originMethod.apply(this, args)
              }
            },
            true
          )
        })
      }
    }
    invokeCallbackInReplacePage((pageOptions) => {
      monitorDomWithOption(pageOptions)
    })
    invokeCallbackInReplaceBehavior((options) => {
      monitorDomWithOption(options)
    })
    invokeCallbackInReplaceComponent((componentOptions) => {
      monitorDomWithOption(componentOptions)
    })
  },
  transform(e: WechatMiniprogram.BaseEvent) {
    let type = WxBreadcrumbTypes.TOUCHMOVE
    if (e.type === LinstenerTypes.Tap) {
      type = WxBreadcrumbTypes.TAP
    }
    const data = targetAsString(e)
    return { data, type }
  },
  consumer({ data, type }: { data: string; type: WxBreadcrumbTypes }) {
    addBreadcrumbInWx.call(this, data, type)
  }
}

function invokeCallbackInReplaceBehavior(callback: (options: any) => void) {
  if (!Behavior) {
    return
  }
  const originBehavior = Behavior
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Behavior = function (behaviorOptions): WechatMiniprogram.Behavior.Constructor {
    if (!isEmptyObject(behaviorOptions.methods)) {
      /*
       * 当使用Compnent直接构造页面时，用到的behavior中如果有onShow等页面生命周期函数是不会被触发的，所以只用监听手势行为
       */
      callback(behaviorOptions.methods)
    }
    return originBehavior.call(this, behaviorOptions)
  }
}

export default wxDomPlugin
