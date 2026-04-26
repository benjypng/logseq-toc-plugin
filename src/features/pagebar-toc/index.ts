import '@logseq/libs'

import { BlockEntity } from '@logseq/libs/dist/LSPlugin'

import { getHeadersArr, HeaderInterface } from '../../libs/get-headers-arr'

export const setupPagebarToc = async () => {
  const stickyStyle = parent.document.createElement('style')
  stickyStyle.textContent = `
    .ls-page-title + .flex.flex-row,
    div.flex.flex-row.space-between {
      position: sticky;
      top: 0;
      z-index: 99;
      background: color-mix(in srgb, var(--ls-primary-background-color) 80%, transparent);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
  `
  parent.document.head.appendChild(stickyStyle)

  const tocOverlay = parent.document.createElement('div')
  tocOverlay.id = 'toc-overlay'
  tocOverlay.style.cssText =
    'display: none; position: absolute; z-index: 9999; padding: 8px 12px; max-height: 70vh; overflow-y: auto; background: var(--ls-primary-background-color); border: 1px solid var(--ls-border-color); border-radius: 6px; min-width: 200px; font-size: 13px; line-height: 1.6; box-shadow: 0 2px 8px rgba(0,0,0,0.15);'
  parent.document.body.appendChild(tocOverlay)

  const renderTocOverlay = (headers: HeaderInterface[], pageName: string) => {
    tocOverlay.innerHTML = headers
      .map((h) => {
        const text = h.content.replace(/^#{1,6}\s+/, '')
        const indent = (h.level - 1) * 12
        return `<a data-uuid="${h.uuid}" data-page="${pageName}" style="display: block; padding-left: ${indent}px; color: var(--ls-link-text-color); text-decoration: none; cursor: pointer;">${text}</a>`
      })
      .join('')

    tocOverlay.querySelectorAll('a[data-uuid]').forEach((el) => {
      el.addEventListener('click', () => {
        const uuid = el.getAttribute('data-uuid')!
        const page = el.getAttribute('data-page')!
        logseq.Editor.scrollToBlockInPage(page, uuid)
        tocOverlay.style.display = 'none'
        const icon =
          parent.document.getElementById('toc-icon') ??
          document.getElementById('toc-icon')
        if (icon) icon.innerHTML = '▶'
      })
    })
  }

  const setTocVisibility = (visible: boolean) => {
    const container =
      parent.document.getElementById('toc-container') ??
      document.getElementById('toc-container')
    if (container) {
      container.style.display = visible ? '' : 'none'
    }
    if (!visible) {
      tocOverlay.style.display = 'none'
    }
  }

  const updateToc = async (uuid: string): Promise<boolean> => {
    const blk = await logseq.Editor.getBlock(uuid, { includeChildren: true })

    let blocks: BlockEntity[]

    if (!blk) {
      const pbt = await logseq.Editor.getPageBlocksTree(uuid)
      if (!pbt) return false
      blocks = pbt
    } else {
      blocks = (blk.children as BlockEntity[]) ?? []
    }

    const headers = getHeadersArr(blocks)
    renderTocOverlay(headers, uuid)
    return headers.length > 0
  }

  let currentPageUuid: string | null = null

  const setupPageToc = async (uuid: string) => {
    const hasHeaders = await updateToc(uuid)
    setTocVisibility(hasHeaders)

    const page = await logseq.Editor.getCurrentPage()
    if (!page) return

    const pageUuid = page.uuid ?? page.name
    currentPageUuid = pageUuid

    logseq.DB.onBlockChanged(pageUuid, async () => {
      if (currentPageUuid !== pageUuid) return
      const hasHeaders = await updateToc(uuid)
      setTocVisibility(hasHeaders)
    })
  }

  const currentPage = await logseq.Editor.getCurrentPage()
  if (currentPage) {
    await setupPageToc(String(currentPage.name ?? currentPage.uuid))
  } else {
    setTocVisibility(false)
  }

  logseq.App.onRouteChanged(
    async ({
      parameters: {
        path: { name: uuid },
      },
    }) => {
      if (!uuid) {
        currentPageUuid = null
        setTocVisibility(false)
        return
      }
      const page = await logseq.Editor.getCurrentPage()
      if (!page) {
        currentPageUuid = null
        setTocVisibility(false)
        return
      }
      await setupPageToc(uuid)
    },
  )

  logseq.provideModel({
    toggleToc() {
      const icon =
        parent.document.getElementById('toc-icon') ??
        document.getElementById('toc-icon')
      if (!icon) return

      if (tocOverlay.style.display === 'none') {
        const btn =
          parent.document.getElementById('toc-container') ??
          document.getElementById('toc-container')
        if (btn) {
          const rect = btn.getBoundingClientRect()
          tocOverlay.style.top = rect.bottom + 4 + 'px'
          tocOverlay.style.right =
            parent.document.documentElement.clientWidth - rect.right + 'px'
          tocOverlay.style.left = 'auto'
        }
        tocOverlay.style.display = 'block'
        icon.innerHTML = '▼'
      } else {
        tocOverlay.style.display = 'none'
        icon.innerHTML = '▶'
      }
    },
  })

  logseq.App.registerUIItem('pagebar', {
    key: 'logseq-toc-plugin',
    template: `
      <div id="toc-container" style="display: none; position: relative; font-size: 13px; line-height: 1.6;">
        <div data-on-click="toggleToc" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; cursor: pointer;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </div>
          <span id="toc-icon" style="font-size: 10px; margin-left: 8px;">&#9654;</span>
        </div>
      </div>
    `,
  })
}
