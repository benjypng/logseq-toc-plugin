import '@logseq/libs'

import { BlockEntity } from '@logseq/libs/dist/LSPlugin'
import { createRoot } from 'react-dom/client'

import pageTocCss from './features/page-toc.css?raw'
import PageToc from './features/PageToc'
import { getHeadersArr } from './libs/get-headers-arr'
import { settings } from './settings'

const main = async () => {
  console.log('logseq-toc-plugin loaded')
  logseq.provideStyle(pageTocCss)

  if (logseq.settings!.pageLevelToc) {
    const container = parent.document.querySelector('.nav-contents-container')
    if (!container || !container.isConnected) return

    // Handle weird restarts of plugin
    const currentEl = parent.document.querySelector('#logseq_toc_plugin')
    if (currentEl) container.removeChild(currentEl)

    // Mount root
    const el = parent.document.createElement('div')
    el.id = `logseq_toc_plugin`
    container.appendChild(el)
    const root = createRoot(el)
    if (!logseq.settings!.pageLevelToc) root.unmount()

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

        // Handle page changes
        const pbt = await logseq.Editor.getPageBlocksTree(name)
        if (!pbt) return
        const headers = getHeadersArr(pbt)
        if (!headers) return
        root.render(<PageToc pageName={name} data={headers} />)

        // Handle block changes
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

  logseq.Editor.registerSlashCommand(
    'Insert inline Table of Contents',
    async (e) => {
      await logseq.Editor.insertAtEditingCursor(`{{renderer :toc_${e.uuid}}}`)
    },
  )

  logseq.App.onMacroRendererSlotted(
    async ({ slot, payload: { uuid, arguments: args } }) => {
      const [type] = args
      if (!type || !type.startsWith(':toc_')) return

      const tocId = `toc_${uuid}_${slot}`
      const blk = await logseq.Editor.getBlock(uuid, { includeChildren: true })
      if (!blk || !blk.children) return
      const headers = getHeadersArr(blk.children as BlockEntity[])
      if (!headers) return
      const page = await logseq.Editor.getPage(blk.page.id)
      if (!page) return

      logseq.provideUI({
        key: tocId,
        slot,
        reset: true,
        template: `<div id=${tocId}></div>`,
      })

      setTimeout(() => {
        const root = createRoot(parent.document.querySelector(`#${tocId}`)!)
        root.render(<PageToc pageName={page.name} data={headers} />)
      }, 0)
    },
  )
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
