import '@logseq/libs'

import { createRoot } from 'react-dom/client'

import PageToc from '../../components/PageToc'
import { getHeadersArr } from '../../libs/get-headers-arr'

export const setupPageLevelToc = () => {
  if (!logseq.settings!.pageLevelToc) return

  const container = parent.document.querySelector('.nav-contents-container')
  if (!container || !container.isConnected) return

  const currentEl = parent.document.querySelector('#logseq_toc_plugin')
  if (currentEl) container.removeChild(currentEl)

  const el = parent.document.createElement('div')
  el.id = `logseq_toc_plugin`
  container.appendChild(el)
  const root = createRoot(el)

  logseq.App.onRouteChanged(
    async ({
      parameters: {
        path: { name },
      },
    }) => {
      if (!el || !root || !name) {
        root.render(<PageToc pageName={name} data={[]} />)
        return
      }

      const pbt = await logseq.Editor.getPageBlocksTree(name)
      if (!pbt) return
      const headers = getHeadersArr(pbt)
      if (!headers) return
      root.render(<PageToc pageName={name} data={headers} />)

      const page = await logseq.Editor.getPage(name)
      if (!page) return
      logseq.DB.onBlockChanged(page.uuid, async () => {
        if (!el || !root || !name) return

        const pbt = await logseq.Editor.getPageBlocksTree(page.uuid)
        if (!pbt) return
        const headers = getHeadersArr(pbt)
        if (!headers) return
        root.render(<PageToc pageName={name} data={headers} />)
      })
    },
  )
}
