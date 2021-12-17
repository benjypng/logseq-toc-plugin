import '@logseq/libs';
import tocCss from './tocCss';
import utils from './utils';

const main = async () => {
  console.log('toc plugin loaded');

  // Generate unique identifier
  const uniqueIdentifier = () =>
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '');

  logseq.Editor.registerSlashCommand('toc', async () => {
    await logseq.Editor.insertAtEditingCursor(
      `{{renderer :toc_${uniqueIdentifier()}}}`
    );
  });

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    // Get basic information about renderer block
    const uuid = payload.uuid;
    const [type] = payload.arguments;

    // Deconstruct slot ID to make tocId
    const id = type.split('_')[1]?.trim();
    const tocId = `toc_${id}`;

    // Get renderer block to search children for header blocks
    const tocHeader = await logseq.Editor.getBlock(uuid, {
      includeChildren: true,
    });

    // Recursive function to map all headers in a linear array
    let tocBlocks = []; // Empty array to push filtered strings to
    const findAllHeaders = (childrenArr) => {
      for (let a = 0; a < childrenArr.length; a++) {
        if (childrenArr[a].content.startsWith('# ')) {
          tocBlocks.push({
            content: childrenArr[a].content,
            uuid: childrenArr[a].uuid,
          });
        } else if (childrenArr[a].content.startsWith('## ')) {
          tocBlocks.push({
            content: childrenArr[a].content,
            uuid: childrenArr[a].uuid,
          });
        }
        if (childrenArr[a].children) {
          findAllHeaders(childrenArr[a].children);
        } else {
          return;
        }
      }
    };
    // Call function to create array of headers
    findAllHeaders(tocHeader.children);

    // Provide style to TOC
    logseq.provideStyle(`${tocCss()}`);

    if (!type.startsWith(':toc_')) return;
    logseq.provideUI({
      key: `${tocId}`,
      slot,
      reset: true,
      template: utils.renderToc(tocBlocks, slot, tocId),
    });
  });
};

logseq.ready(main).catch(console.error);
