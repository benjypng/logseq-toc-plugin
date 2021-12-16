import '@logseq/libs';

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

    // Function to map all headers in a linear array
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
    logseq.provideStyle(`
    .tocBoard {
      display: flex;
      flex-direction: column;
      padding: 1em;
      border: 1px dashed #C0C0C0;
    }

    .toc {
      margin-top: 0 !important;
    }

    .headerOne {
      border-top: 1px solid #C0C0C0;
      border-bottom: 1px solid #C0C0C0;
      margin-top: 3px;
      padding: 0 1em;
    }

    .headerTwo {
      margin-top: 3px;
      display: list-item;          
      list-style-type: disc;       
      list-style-position: inside; 
      padding: 0 1em;
    }

    .headerOne:hover, .headerTwo:hover {
      cursor: pointer;
      border: 1px dashed red;
    }

    .ti-arrow-bar-right:hover {
      cursor: pointer;
    }
    `);

    const renderToc = () => {
      // Function to go to Block
      const goTo = (x) => {
        logseq.Editor.scrollToBlockInPage(x);
      };

      // Create model for each section so as to enable events
      let models = {};
      for (let m = 0; m < tocBlocks.length; m++) {
        models['show' + m] = function () {
          goTo(tocBlocks[m].uuid);
        };
      }
      logseq.provideModel(models);

      // Create table of contents in html
      let html = '';
      for (let i = 0; i < tocBlocks.length; i++) {
        const blockContent = tocBlocks[i].content;

        // Check if block is not collapsed and if header 1
        // Check if block is not collapsed and if header 2

        // Check if block is collapsed and if header 1
        if (
          blockContent.includes('collapsed:: true') &&
          blockContent.startsWith('# ')
        ) {
          html += `<div class="headerOne" data-slot-id=${slot}data-id="${tocId}" data-on-click="show${i}">${blockContent.substring(
            2,
            blockContent.length - 16
          )}</div>`;

          // Check if block is collapsed and if header 2
        } else if (
          blockContent.includes('collapsed:: true') &&
          blockContent.startsWith('## ')
        ) {
          html += `<div class="headerTwo" data-slot-id=${slot}data-id="${tocId}" data-on-click="show${i}">${blockContent.substring(
            3,
            blockContent.length - 16
          )}</div>`;
        } else if (blockContent.startsWith('# ')) {
          html += `<div class="headerOne" data-slot-id=${slot}data-id="${tocId}" data-on-click="show${i}">${blockContent.substring(
            2
          )}</div>`;
        } else if (blockContent.startsWith('## ')) {
          html += `<div class="headerTwo" data-slot-id=${slot}data-id="${tocId}" data-on-click="show${i}">${blockContent.substring(
            3
          )}</div>`;
        }
      }

      // Open TOC in right sidebar
      logseq.provideModel({
        openInRightSidebar() {
          logseq.Editor.openInRightSidebar(uuid);
        },
      });

      return `<div class="tocBoard"><h2 class="toc">Table of Contents <i data-on-click="openInRightSidebar" class="ti ti-arrow-bar-right"></i></h2>${html}</div>`;
    };

    if (!type.startsWith(':toc_')) return;
    logseq.provideUI({
      key: `${tocId}`,
      slot,
      reset: true,
      template: renderToc(),
    });
  });
};

logseq.ready(main).catch(console.error);
