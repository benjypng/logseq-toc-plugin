![GitHub all releases](https://img.shields.io/github/downloads/hkgnp/logseq-toc-plugin/total)

# Introduction

Interactive (style-able), real-time rendering of Table of Contents from markdown headers (#, ##, ###, ####, #####, ######).

![](/screenshots/demo.gif)

## Block references as Section Headers

![](/screenshots/demo2.gif)

# Installation

This plugin is available on the marketplace. Just install it from there!

# Changing Colours

The CSS classes to change the look of the TOC are as follows. Please add them to your `custom.css` file to make the changes. Have fun!

```
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
```

# Future

- [x] Refactoring
- [x] Open TOC in right sidebar
