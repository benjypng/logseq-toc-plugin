import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user'

export interface HeaderInterface {
  content: string
  uuid: string
  level: number
}

const UUID_REF_REGEX =
  /(?:\[\[|\(\()([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})(?:\]\]|\)\))/g

const resolveUuidRefs = async (content: string): Promise<string> => {
  const matches = [...content.matchAll(UUID_REF_REGEX)]
  let resolved = content

  for (const match of matches) {
    const uuid = match[1]!
    const block = await logseq.Editor.getBlock(uuid)
    const title = block?.content?.split('\n')[0]?.trim()

    if (title) {
      resolved = resolved.replace(match[0], title)
      continue
    }

    const page = await logseq.Editor.getPage(uuid)
    if (page) {
      resolved = resolved.replace(match[0], page.originalName ?? page.name)
    }
  }

  return resolved
}

export const getHeadersArr = async (
  blocks: BlockEntity[],
): Promise<HeaderInterface[]> => {
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

  return Promise.all(
    headers.map(async (header) => ({
      ...header,
      content: await resolveUuidRefs(header.content),
    })),
  )
}
