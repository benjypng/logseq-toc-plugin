import { ReactElement, useEffect, useState } from 'react';

import { HeaderInterface } from '../libs/get-headers-arr'

type VisibilityState = Record<string, boolean>;

const headerLevelConversion = (item: HeaderInterface, numbering: number[]) => {
  if (!item.content) return;

  const level = item.content.split(' ')[0]!.length; // Get number of #

  if (numbering.length < level) {
    // If the current level is greater than the length of numbering, add a new sub-level
    numbering.push(1);
  } else if (numbering.length === level) {
    // If the current level is the same, increment the last number
    numbering[numbering.length - 1]!++;
  } else {
    // If the current level is less, cut off the deeper levels and increment the current level
    numbering.splice(level);
    numbering[numbering.length - 1]!++;
  }

  const pathIndices = numbering.join("-");

  return { pathIndices, level };
};

const PageToc = ({
  pageName,
  data,
}: {
  pageName: string
  data: HeaderInterface[]
}) => {
  if (data.length === 0 || data.every(item => !item.content)) {
    return null; // Don't render TOC if no headers
  }
  const [visibility, setVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    const initialVisibility: VisibilityState = {};
    const numbering: number[] = [];
    data.forEach((item) => {
      const result = headerLevelConversion(item, numbering);
      initialVisibility[result!.pathIndices] = true; // Default all to visible initially
    });
    setVisibility(initialVisibility);
  }, [data]);

  const collapseChildVisibility = (parentKey: string) => {
    const updatedVisibility = { ...visibility };

    const allFalse = Object.keys(updatedVisibility)
      .filter(key => key.startsWith(`${parentKey}-`) && key != '0')
      .every(key => updatedVisibility[key] === false);

    Object.keys(updatedVisibility).forEach(key => {
      // Check if the current key is a descendant of the parentKey
      if (key.startsWith(`${parentKey}-`) && key != '0') {
        if (updatedVisibility[parentKey] === true && updatedVisibility[key] === false && !allFalse) {
          updatedVisibility[key] = false; // check the special case that some children are already collapsed
        } else {
          updatedVisibility[key] = !updatedVisibility[key];
        }
      }
    });

    setVisibility(updatedVisibility);
  };

  const goToHeader = (uuid: string) => {
    logseq.Editor.scrollToBlockInPage(pageName, uuid, { replaceState: true })
  }

  const generateCollapsibleTOC = () => {
    const toc: ReactElement[] = []
    const stack: number[] = []
    const numbering: number[] = []

    data.forEach((item, index) => {
      const result = headerLevelConversion(item, numbering);
      // Remove #, and other properties from the content
      const content = item.content
        .replace(
          /#powerblocks-button|#powerblocks|(.+?)::\s*([^\n]*)|^#+\s/g,
          '',
        )
        .trim()

      const hasChild = data.some((child, childIndex) => {
        if (!child || !child.content) {
          return false;
        }

        const childLevel = child.content.split(' ')[0]?.length || 1;
        const isDirectChild = childLevel > (result!.level ?? 0);  // Check if the child is nested deeper than the current level
        const isAfterCurrent = childIndex > index; // Ensure it is after the current item

        return isDirectChild && isAfterCurrent;
      });

      // Reset nesting if stack is more than current level
      while (stack.length > 0 && stack[stack.length - 1]! >= result!.level) {
        stack.pop()
      }
      stack.push(result!.level)

      if (visibility[result!.pathIndices]) {
        const isChildrenVisible = Object.keys(visibility).some(
          childKey => childKey.startsWith(`${result!.pathIndices}-`) && visibility[childKey]
        );

        const collapseIcon = hasChild ? (isChildrenVisible ? logseq.settings?.collapseIcon[1] : logseq.settings?.collapseIcon[0]) : logseq.settings?.collapseIcon[0];

        toc.push(
          <li key={item.uuid} className={`toc-item indent-${result!.level}`}>
            {(result!.level ?? 0) > 0 && (
              logseq.settings?.hideCollapseIcon ? (
                <button
                  className="button-light"
                  onClick={() => collapseChildVisibility(result!.pathIndices)}>
                  {collapseIcon}
                </button>
              ) : (
                <button
                  className="button-light"
                  style={{ opacity: 0.4 }}
                  onClick={() => collapseChildVisibility(result!.pathIndices)}>
                  {collapseIcon}
                </button>
              )
            )
            }
            <span className="icon-text-spacer"></span>
            <span onClick={() => goToHeader(item.uuid)}>{content}</span>
          </li >
        );
      }
    })
    return toc
  }

  const generateTOC = () => {
    const toc: ReactElement[] = []
    // Check current number of levels
    const stack: number[] = []

    // Generate table of contents
    data.forEach((item) => {
      if (!item.content) return
      // Get number of #
      const level = item.content.split(' ')[0]!.length
      // Remove #, and other properties from the content
      const content = item.content
        .replace(
          /#powerblocks-button|#powerblocks|(.+?)::\s*([^\n]*)|^#+\s/g,
          '',
        )
        .trim()

      // Reset nesting if stack is more than current level
      while (stack.length > 0 && stack[stack.length - 1]! >= level) {
        stack.pop()
      }
      stack.push(level)
      toc.push(
        <li
          key={item.uuid}
          className={`toc-item indent-${stack.length}`}
          onClick={() => goToHeader(item.uuid)}
        >
          {content}
        </li>,
      )
    })
    return toc
  }

  return (
    <nav className="toc">
      <div className="toc-header">{logseq.settings!.tocTitle}</div>
      {logseq.settings!.collapsibleTOC ? <ul>{generateCollapsibleTOC()}</ul> : <ul>{generateTOC()}</ul>}
    </nav>
  )
}

export default PageToc

