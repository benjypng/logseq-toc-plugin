import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user'

export interface HeaderInterface {
  content: string
  uuid: string
  level: number
}

export const getHeadersArr = (blocks: BlockEntity[]): HeaderInterface[] => {
  const headers: HeaderInterface[] = []

  const findAllHeaders = (blocks: BlockEntity[]) => {
    for (const block of blocks) {
      const content = block.content
      const headingProp = (block as Record<string, unknown>)[
        ':logseq.property/heading'
      ] as number | undefined

      if (content && /^#{1,6} /.test(content)) {
        const match = content.match(/^(#{1,6}) /)!
        headers.push({
          content,
          uuid: block.uuid,
          level: match[1]!.length,
        })
      } else if (content && headingProp) {
        headers.push({
          content,
          uuid: block.uuid,
          level: headingProp,
        })
      }

      if (block.children) findAllHeaders(block.children as BlockEntity[])
    }
  }
  findAllHeaders(blocks)
  return headers
}
