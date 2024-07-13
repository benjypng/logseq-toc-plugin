[:gift_heart: Sponsor this project on Github](https://github.com/sponsors/benjypng) or [:coffee: Get me a coffee](https://www.buymeacoffee.com/hkgnp.dev) if you like this plugin!

# Introduction

Interactive (style-able), real-time rendering of Table of Contents from markdown headers (#, ##, ###, ####, #####, ######).

![](/screenshots/pagetoc.gif)

# Usage

## Page-level table of contents

This is enabled by default. When encountering a page with markdown headers, a table of contents will be displayed on the left sidebar. You may change the header text (e.g. `Table of Contents`) in the plugin settings.

## Inserting inline table of contents

Simply type `/Insert inline Table of Contents` and a Table of Contents will be generated based on the nested blocks under the Table of Contents block. Structure will follow the level of markdown headers.

# Installation

This plugin is available on the marketplace.


# Changing Colours

The CSS classes to change the look of the TOC are as follows. Please add them to your `custom.css` file to make the changes. Do note that you have to add `!important` so as to override the existing plugin style.

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
