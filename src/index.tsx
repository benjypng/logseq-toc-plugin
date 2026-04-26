import '@logseq/libs'

import pageTocCss from './components/page-toc.css?raw'
import { setupInlineToc } from './features/inline-toc'
import { setupPageLevelToc } from './features/page-level-toc'
import { setupPagebarToc } from './features/pagebar-toc'
import { settings } from './settings'

const main = async () => {
  logseq.UI.showMsg('logseq-toc-plugin loaded')
  logseq.provideStyle(pageTocCss)

  await setupPagebarToc()
  setupPageLevelToc()
  setupInlineToc()
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
