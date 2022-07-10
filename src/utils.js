const getTocBlocks = (childrenArr) => {
  let tocBlocks = []; // Empty array to push filtered strings to
  // Recursive function to map all headers in a linear array
  const findAllHeaders = (childrenArr) => {
    for (let a = 0; a < childrenArr.length; a++) {
      if (childrenArr[a].content.startsWith("# ")) {
        tocBlocks.push({
          content: childrenArr[a].content,
          uuid: childrenArr[a].uuid,
        });
      } else if (childrenArr[a].content.startsWith("## ")) {
        tocBlocks.push({
          content: childrenArr[a].content,
          uuid: childrenArr[a].uuid,
        });
      } else if (childrenArr[a].content.startsWith("### ")) {
        tocBlocks.push({
          content: childrenArr[a].content,
          uuid: childrenArr[a].uuid,
        });
      } else if (childrenArr[a].content.startsWith("#### ")) {
        tocBlocks.push({
          content: childrenArr[a].content,
          uuid: childrenArr[a].uuid,
        });
      } else if (childrenArr[a].content.startsWith("##### ")) {
        tocBlocks.push({
          content: childrenArr[a].content,
          uuid: childrenArr[a].uuid,
        });
      } else if (childrenArr[a].content.startsWith("###### ")) {
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

  findAllHeaders(childrenArr);
  return tocBlocks;
};

const renderToc = async (tocBlocks, slot, tocId, uuid, parentPage) => {
  // Function to go to Block
  const goTo = (x) => {
    if (logseq.settings.openBlockInNewPage) {
      logseq.Editor.scrollToBlockInPage(x);
    } else {
      logseq.Editor.scrollToBlockInPage(parentPage, x);
    }
  };

  // Create model for each section so as to enable events
  let models = {};
  for (let m = 0; m < tocBlocks.length; m++) {
    models["show" + m] = function () {
      goTo(tocBlocks[m].uuid);
    };
  }
  logseq.provideModel(models);

  // Create table of contents in html
  let html = "";
  for (let i = 0; i < tocBlocks.length; i++) {
    let blockContent = tocBlocks[i].content;

    blockContent = blockContent.substring(0, blockContent.indexOf("\n"));

    if (blockContent.includes("((") && blockContent.includes("))")) {
      // Get content if it's q block reference
      const rxGetId = /\(([^(())]+)\)/;
      const blockId = rxGetId.exec(blockContent);
      const block = await logseq.Editor.getBlock(blockId[1], {
        includeChildren: true,
      });

      blockContent = blockContent.replace(
        `((${blockId[1]}))`,
        block.content.substring(0, block.content.indexOf("id::"))
      );
    }

    if (blockContent.includes("id:: ")) {
      blockContent = blockContent.substring(0, blockContent.indexOf("id:: "));
    }

    // Header 1
    if (blockContent.startsWith("# ")) {
      html += `<div class="headerOne" data-slot-id=${slot} data-id="${tocId}" data-on-click="show${i}">${
        (blockContent.includes("collapsed:: true") &&
          blockContent.substring(2, blockContent.length - 16)) ||
        blockContent.substring(2)
      }</div>`;

      // Header 2
    } else if (blockContent.startsWith("## ")) {
      html += `<div class="headerTwo" data-slot-id=${slot} data-id="${tocId}" data-on-click="show${i}">${
        (blockContent.includes("collapsed:: true") &&
          blockContent.substring(3, blockContent.length - 16)) ||
        blockContent.substring(3)
      }</div>`;

      // Header 3
    } else if (blockContent.startsWith("### ")) {
      html += `<div class="headerThree" data-slot-id=${slot} data-id="${tocId}" data-on-click="show${i}">${
        (blockContent.includes("collapsed:: true") &&
          blockContent.substring(4, blockContent.length - 16)) ||
        blockContent.substring(4)
      }</div>`;

      // Header 4
    } else if (blockContent.startsWith("#### ")) {
      html += `<div class="headerFour" data-slot-id=${slot} data-id="${tocId}" data-on-click="show${i}">${
        (blockContent.includes("collapsed:: true") &&
          blockContent.substring(5, blockContent.length - 16)) ||
        blockContent.substring(5)
      }</div>`;

      // Header 5
    } else if (blockContent.startsWith("##### ")) {
      html += `<div class="headerFive" data-slot-id=${slot} data-id="${tocId}" data-on-click="show${i}">${
        (blockContent.includes("collapsed:: true") &&
          blockContent.substring(6, blockContent.length - 16)) ||
        blockContent.substring(6)
      }</div>`;

      // Header 6
    } else if (blockContent.startsWith("###### ")) {
      html += `<div class="headerSix" data-slot-id=${slot} data-id="${tocId}" data-on-click="show${i}">${
        (blockContent.includes("collapsed:: true") &&
          blockContent.substring(7, blockContent.length - 16)) ||
        blockContent.substring(7)
      }</div>`;
    }
  }

  // Open TOC in right sidebar
  logseq.provideModel({
    openInRightSidebar() {
      logseq.Editor.openInRightSidebar(uuid);
    },
  });

  return `<div class="tocBoard" data-slot-id="${tocId}" data-toc-id="${tocId}"><h2 class="toc">Table of Contents <i data-on-click="openInRightSidebar" class="ti ti-arrow-bar-right"></i></h2>${html}</div>`;
};

export default { getTocBlocks, renderToc };
