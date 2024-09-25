import { BasePluginType } from '@mitojs/types'
import wxAppPlugins from './plugins/aliApp'
import wxConsolePlugin from './plugins/aliConsole'
import wxDomPlugin from './plugins/aliDom'
import wxPagePlugins from './plugins/aliPage'
import wxRequestPlugin from './plugins/aliRequest'
import wxRoutePlugin from './plugins/aliRoute'
import { AliOptionsFieldsTypes } from './types'
import { AliClient } from './aliClient'

function createAliInstance(options: AliOptionsFieldsTypes, plugins: BasePluginType[] = []) {
  const aliClient = new AliClient(options)
  const wxPlugins = [wxRequestPlugin, wxRoutePlugin, wxConsolePlugin, wxDomPlugin, ...wxAppPlugins, ...wxPagePlugins, ...plugins]
  aliClient.use(wxPlugins)
  return aliClient
}

const init = createAliInstance
export { init, AliClient }
