import { ReactElement } from 'react'

import { HeaderInterface } from '../libs/get-headers-arr'

const PageToc = ({
  pageName,
  data,
}: {
  pageName: string
  data: HeaderInterface[]
}) => {
  if (data.length == 0) return

  const goToHeader = async (uuid: string) => {
    // Check if the target block is already rendered in DOM
    const blockEl = parent.document.querySelector(`[blockid="${uuid}"]`)
    if (blockEl) {
      // Block is loaded, use standard smooth scroll
      await logseq.Editor.scrollToBlockInPage(pageName, uuid, { replaceState: true })
      return
    }

    // Block is not loaded due to lazy-loading
    // Force trigger lazy-loading by scrolling and watching for DOM changes
    const scrollContainer = parent.document.querySelector('#main-content-container')
    if (!scrollContainer) {
      await logseq.Editor.scrollToBlockInPage(pageName, uuid, { replaceState: true })
      return
    }

    const targetSelector = `[blockid="${uuid}"]`
    const timeout = 15000 // 15 seconds max
    const startTime = Date.now()

    // Use MutationObserver to detect when target block appears
    const waitForBlock = (): Promise<boolean> => {
      return new Promise((resolve) => {
        // Check if already exists
        if (parent.document.querySelector(targetSelector)) {
          resolve(true)
          return
        }

        let lastScrollHeight = scrollContainer.scrollHeight
        let noChangeCount = 0

        const observer = new MutationObserver(() => {
          const targetEl = parent.document.querySelector(targetSelector)
          if (targetEl) {
            observer.disconnect()
            clearInterval(scrollInterval)
            resolve(true)
          }
        })

        // Observe the scroll container for new blocks
        observer.observe(scrollContainer, {
          childList: true,
          subtree: true,
        })

        // Periodically scroll to trigger lazy-loading
        const scrollInterval = setInterval(() => {
          // Check timeout
          if (Date.now() - startTime > timeout) {
            observer.disconnect()
            clearInterval(scrollInterval)
            resolve(false)
            return
          }

          // Check if target appeared
          if (parent.document.querySelector(targetSelector)) {
            observer.disconnect()
            clearInterval(scrollInterval)
            resolve(true)
            return
          }

          // Check if we've reached the bottom (no more content to load)
          const currentScrollHeight = scrollContainer.scrollHeight
          if (
            scrollContainer.scrollTop + scrollContainer.clientHeight >=
            currentScrollHeight - 10
          ) {
            if (currentScrollHeight === lastScrollHeight) {
              noChangeCount++
              if (noChangeCount >= 5) {
                // No new content loaded after 5 checks
                observer.disconnect()
                clearInterval(scrollInterval)
                resolve(false)
                return
              }
            } else {
              noChangeCount = 0
              lastScrollHeight = currentScrollHeight
            }
          }

          // Scroll down by one viewport height
          const scrollStep = scrollContainer.clientHeight
          scrollContainer.scrollTop += scrollStep
        }, 300) // Wait 300ms between scrolls for content to load
      })
    }

    const found = await waitForBlock()

    if (found) {
      await logseq.Editor.scrollToBlockInPage(pageName, uuid, { replaceState: true })
    } else {
      await logseq.App.pushState('page', { name: uuid })
    }
  }

  const generateTOC = () => {
    const toc: ReactElement[] = []
    // Check current number of levels
    const stack: number[] = []

    // Generate table of contents
    data.forEach((item) => {
      if (!item.content) return
      // Get number of #
      const level = item.content.split(' ')[0]!.length
      // Remove #, and other properties from the content
      const content = item.content
        .replace(
          /#powerblocks-button|#powerblocks|(.+?)::\s*([^\n]*)|^#+\s/g,
          '',
        )
        .trim()

      // Reset nesting if stack is more than current level
      while (stack.length > 0 && stack[stack.length - 1]! >= level) {
        stack.pop()
      }
      stack.push(level)
      toc.push(
        <li
          key={item.uuid}
          className={`toc-item indent-${stack.length}`}
          onClick={() => goToHeader(item.uuid)}
        >
          {content}
        </li>,
      )
    })
    return toc
  }

  return (
    <nav className="toc">
      <div className="toc-header">{logseq.settings!.tocTitle}</div>
      <ul>{generateTOC()}</ul>
    </nav>
  )
}

export default PageToc
