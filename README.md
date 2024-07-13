[:gift_heart: Sponsor this project on Github](https://github.com/sponsors/benjypng) or [:coffee: Get me a coffee](https://www.buymeacoffee.com/hkgnp.dev) if you like this plugin!

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
.toc {
  border: 1px solid #a2a9b1;
  padding: 10px;
  font-size: 80%;
  margin: 10px;
}

.toc-header {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.toc ul {
  list-style-type: none;
  margin-left: 0;
}

.toc-item {
  color: #0645ad;
  text-decoration: none;
  color: var(--lx-accent-11,var(--ls-link-text-color,hsl(var(--primary)/.8)));
}

.toc-item:hover {
  text-decoration: underline;
  cursor: pointer;
}

.indent-1 { margin-left: 0; }
.indent-2 { margin-left: 1.5em; }
.indent-3 { margin-left: 3em; }
.indent-4 { margin-left: 4.5em; }
.indent-5 { margin-left: 6em; }
.indent-6 { margin-left: 7.5em; }
```
