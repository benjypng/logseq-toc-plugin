import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user'

export interface HeaderInterface {
  content: string
  uuid: string
}

export const getHeadersArr = (blocks: BlockEntity[]): HeaderInterface[] => {
  const headers: HeaderInterface[] = []

  const findAllHeaders = (blocks: BlockEntity[]) => {
    for (const block of blocks) {
      switch (true) {
        case block.content.startsWith('# '):
          headers.push({
            content: block.content,
            uuid: block.uuid,
          })
          break
        case block.content.startsWith('## '):
          headers.push({
            content: block.content,
            uuid: block.uuid,
          })
          break
        case block.content.startsWith('### '):
          headers.push({
            content: block.content,
            uuid: block.uuid,
          })
          break
        case block.content.startsWith('#### '):
          headers.push({
            content: block.content,
            uuid: block.uuid,
          })
          break
        case block.content.startsWith('##### '):
          headers.push({
            content: block.content,
            uuid: block.uuid,
          })
          break
        case block.content.startsWith('###### '):
          headers.push({
            content: block.content,
            uuid: block.uuid,
          })
          break
        default:
      }

      if (block.children) findAllHeaders(block.children as BlockEntity[])
    }
  }
  findAllHeaders(blocks)
  return headers
}
