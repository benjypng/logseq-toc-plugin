import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'

export const settings: SettingSchemaDesc[] = [
  {
    key: 'pageLevelToc',
    type: 'boolean',
    default: true,
    description:
      'Turns on page-level table of contents. Restart Logseq after changing this setting.',
    title: '(Recommended) Page-level Table of Contents',
  },
  {
    key: 'tocTitle',
    type: 'string',
    default: 'Table of Contents',
    description: 'Sets the title for the table of contents.',
    title: 'Title',
  },
]
