import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user'

export interface HeaderInterface {
  content: string
  uuid: string
}

export const getHeadersArr = (blocks: BlockEntity[]): HeaderInterface[] => {
  const headers: HeaderInterface[] = []

  const findAllHeaders = (blocks: BlockEntity[]) => {
    for (const block of blocks) {
      const content = block.content
      if (content && /^#{1,6} /.test(content)) {
        headers.push({
          content,
          uuid: block.uuid,
        })
      }

      if (block.children) findAllHeaders(block.children as BlockEntity[])
    }
  }
  findAllHeaders(blocks)
  return headers
}
