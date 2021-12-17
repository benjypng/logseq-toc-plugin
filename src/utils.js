const renderToc = (tocBlocks, slot, tocId) => {
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
      // Check if block is not collapsed and if header 1
    } else if (blockContent.startsWith('# ')) {
      html += `<div class="headerOne" data-slot-id=${slot}data-id="${tocId}" data-on-click="show${i}">${blockContent.substring(
        2
      )}</div>`;
      // Check if block is not collapsed and if header 2
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

export default { renderToc };
