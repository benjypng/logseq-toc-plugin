[[:gift_heart: Sponsor this project on Github](https://github.com/sponsors/hkgnp) or [:coffee: Get me a coffee](https://www.buymeacoffee.com/hkgnp.dev) if you like this plugin!

# Introduction

Interactive (style-able), real-time rendering of Table of Contents from markdown headers (#, ##, ###, ####, #####, ######).

![](/screenshots/demo.gif)

## Block references as Section Headers

![](/screenshots/demo2.gif)

# Installation

This plugin is available on the marketplace. Just install it from there!

# Usage

Simply type `/toc` and a Table of Contents will be generated based on the nested blocks under the Table of Contents block. Structure will follow the level of markdown headers.

Depending on your plugin settings, clicking on the block will either open the block in a separate page **or** scroll to it on the same page.

# Changing Colours

The CSS classes to change the look of the TOC are as follows. Please add them to your `custom.css` file to make the changes. Have fun!

Do note that you have to add `!important` so as to override the existing plugin style.

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
