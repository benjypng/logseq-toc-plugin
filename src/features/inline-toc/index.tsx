import '@logseq/libs'

import { BlockEntity } from '@logseq/libs/dist/LSPlugin'
import { createRoot } from 'react-dom/client'

import PageToc from '../../components/PageToc'
import { getHeadersArr } from '../../libs/get-headers-arr'

export const setupInlineToc = () => {
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
