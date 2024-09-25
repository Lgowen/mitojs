import { BasePluginType } from 'remitojs-types'
import wxAppPlugins from './plugins/aliApp'
import wxConsolePlugin from './plugins/aliConsole'
import wxDomPlugin from './plugins/aliDom'
import wxPagePlugins from './plugins/aliPage'
import wxRequestPlugin from './plugins/aliRequest'
import wxRoutePlugin from './plugins/aliRoute'
import { WxOptionsFieldsTypes } from './types'
import { AliClient } from './aliClient'
// import '@mini-types/alipay'

function createAliInstance(options: WxOptionsFieldsTypes, plugins: BasePluginType[] = []) {
  const aliClient = new AliClient(options)
  const wxPlugins = [wxRequestPlugin, wxRoutePlugin, wxConsolePlugin, wxDomPlugin, ...wxAppPlugins, ...wxPagePlugins, ...plugins]
  aliClient.use(wxPlugins as any)
  return aliClient
}

const init = createAliInstance
export { init, AliClient }
