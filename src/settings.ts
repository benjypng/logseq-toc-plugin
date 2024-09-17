import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'

const iconPairs = [
  ['▶', '▼'],
  ['▷', '▽'],
];

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
  {
    key: 'openBlockInNewPage',
    type: 'boolean',
    default: true,
    description:
      'If set to true, clicking on a section header will open the block in a new page. If false, clicking on the section header will scroll to the block on the same page.',
    title: 'Open block in new page',
  },
  {
    key: 'collapsibleTOC',
    type: 'boolean',
    default: true,
    description:
      'True makes the table of contents collapsible; false makes it fixed.',
    title: 'collapsible Table of Contents',
  },
  {
    key: 'collapseIcon',
    type: 'enum',
    title: 'Collapse Icon',
    description: 'Sets the icon for collapsing the table of contents.',
    enumChoices: iconPairs.map(pair => `${pair[0]}${pair[1]}`),
    default: '▶, ▼'
  },
  {
    key: 'hideCollapseIcon',
    type: 'boolean',
    default: false,
    description: 'Hides the collapse icon when not hovering',
    title: 'Hide Collapse Icon',
  }
]
