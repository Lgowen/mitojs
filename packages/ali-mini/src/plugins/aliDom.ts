import { LinstenerTypes, WxBaseEventTypes, WxBreadcrumbTypes } from '@mitojs/shared'
import { BasePluginType } from '@mitojs/types'
import { replaceOld, throttle } from '@mitojs/utils'
import { addBreadcrumbInWx, targetAsString } from '../utils'
import { AliClient } from '../aliClient'
import { invokeCallbackInReplaceComponent, invokeCallbackInReplacePage } from './aliPage'

const wxDomPlugin: BasePluginType<WxBaseEventTypes, AliClient> = {
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

export default wxDomPlugin
