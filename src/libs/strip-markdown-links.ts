export const stripMarkdownLinks = (content: string): string =>
  content.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
