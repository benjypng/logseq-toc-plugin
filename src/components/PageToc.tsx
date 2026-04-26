import { ReactElement } from 'react'

import { HeaderInterface } from '../libs/get-headers-arr'

const PageToc = ({
  pageName,
  data,
}: {
  pageName: string
  data: HeaderInterface[]
}) => {
  if (data.length == 0) return null

  const goToHeader = (uuid: string) => {
    logseq.Editor.scrollToBlockInPage(pageName, uuid, { replaceState: true })
  }

  const generateTOC = () => {
    const toc: ReactElement[] = []
    const stack: number[] = []

    data.forEach((item) => {
      if (!item.content) return
      const level = item.level
      const content = item.content
        .replace(
          /#powerblocks-button|#powerblocks|(.+?)::\s*([^\n]*)|^#+\s/g,
          '',
        )
        .trim()

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
      <div className="toc-header">{logseq.settings!.tocTitle as string}</div>
      <ul>{generateTOC()}</ul>
    </nav>
  )
}

export default PageToc
