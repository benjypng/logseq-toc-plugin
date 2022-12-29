import "@logseq/libs";
import tocCss from "./tocCss";
import utils from "./utils";

// Generate unique identifier
const uniqueIdentifier = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "");

const main = async () => {
  console.log("toc plugin loaded");

  logseq.useSettingsSchema([
    {
      key: "openBlockInNewPage",
      type: "boolean",
      default: true,
      description:
        "If set to true, clicking on a section header will open the block in a new page. If false, clicking on the section header will scroll to the block on the same page.",
      title: "Open block in new page",
    },
    {
      key: "tocTitle",
      type: "string",
      default: "Table of Contents",
      description: "Sets the title for the table of contents.",
      title: "Title",
    },
  ]);

  logseq.Editor.registerSlashCommand("toc", async () => {
    await logseq.Editor.insertAtEditingCursor(
      `{{renderer :toc_${uniqueIdentifier()}}}`
    );
  });

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    // Get basic information about renderer block
    const uuid = payload.uuid;
    const [type] = payload.arguments;

    if (!type.startsWith(":toc_")) return;

    // Deconstruct slot ID to make tocId
    const id = type.split("_")[1]?.trim();
    const tocId = `toc_${id}_${slot}`;

    // Get renderer block to search children for header blocks
    const tocHeader = await logseq.Editor.getBlock(uuid, {
      includeChildren: true,
    });

    const parentPage = tocHeader.page.originalName;

    // Call function to create array of headers
    let tocBlocks = utils.getTocBlocks(tocHeader.children);

    // Provide style to TOC
    logseq.provideStyle(`${tocCss()}`);

    logseq.provideUI({
      key: `${tocId}`,
      slot,
      reset: true,
      template: await utils.renderToc(tocBlocks, slot, tocId, uuid, parentPage),
    });
  });
};

logseq.ready(main).catch(console.error);
