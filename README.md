# logseq-toc-plugin

![Version](https://img.shields.io/github/v/release/benjypng/logseq-toc-plugin?style=flat-square&color=0969da) ![Downloads](https://img.shields.io/github/downloads/benjypng/logseq-toc-plugin/total?style=flat-square&color=orange) ![License](https://img.shields.io/github/license/benjypng/logseq-toc-plugin?style=flat-square)

> Interactive, real-time tables of contents for Logseq, generated from your markdown headers (`#` through `######`) — in the left sidebar, in a pagebar dropdown, or inline in any page.

---

## ✨ Features

- **Three ways to view a table of contents:**
  - **Left sidebar** — a page-level TOC renders automatically for any page with markdown headers (on by default).
  - **Pagebar dropdown** — a TOC button appears in the pagebar of pages with headers; click it to open a compact dropdown that follows you as you scroll.
  - **Inline** — insert a TOC anywhere in a page via a slash command; it is built from the blocks nested under it.
- **Click to jump:** click any entry to scroll to that header. `Cmd+Click` (`Ctrl+Click` on Windows/Linux) opens it in the right sidebar instead, keeping the main window where it is.
- **Live refresh:** the TOC updates automatically as you edit headers on the current page.
- **Clean entries:** markdown links, properties, and tags are stripped from header text, and block references are resolved to their content.
- **Style-able:** every part of the TOC carries a CSS class you can override from `custom.css`.
- **Configurable title:** change the `Table of Contents` header text in the plugin settings.

## ⚙️ Installation

1. Open Logseq.
2. Go to the **Marketplace** (Plugins > Marketplace).
3. Search for **logseq-toc-plugin**.
4. Click **Install**.

## 🛠 Usage

### Page-level table of contents

Enabled by default. When you visit a page with markdown headers, a table of contents appears in the left sidebar and a TOC button appears in the pagebar. Click the pagebar button to toggle the dropdown TOC; it stays pinned to the top of the window as you scroll.

### Inline table of contents

Type `/Insert inline Table of Contents` in any block. A TOC is generated from the blocks nested under that block, with indentation following the level of the markdown headers.

### Settings

`Logseq Settings > Plugin Settings > logseq-toc-plugin`:

- **Page-level Table of Contents** — turn the sidebar TOC on or off (default on). Restart Logseq after changing this setting.
- **Title** — the header text shown above the TOC (default `Table of Contents`).

### Styling

Add the following classes to your `custom.css` to change the look of the TOC. Note that you may need `!important` to override the plugin's own styles.

```css
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
  text-decoration: none;
  color: var(
    --lx-accent-11,
    var(--ls-link-text-color, hsl(var(--primary) / 0.8))
  );
}

.toc-item:hover {
  text-decoration: underline;
  cursor: pointer;
}

.indent-1 {
  margin-left: 0;
}
.indent-2 {
  margin-left: 1.5em;
}
.indent-3 {
  margin-left: 3em;
}
.indent-4 {
  margin-left: 4.5em;
}
.indent-5 {
  margin-left: 6em;
}
.indent-6 {
  margin-left: 7.5em;
}
```

## ☕️ Support

If you enjoy this plugin, please consider supporting the development.

<div align="center">
  <a href="https://github.com/sponsors/benjypng"><img src="https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?style=for-the-badge&logo=github" alt="Sponsor on Github" /></a>&nbsp;<a href="https://www.buymeacoffee.com/hkgnp.dev"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee" /></a>
</div>

## 🤝 Contributing

Issues are welcome. If you find a bug, please open an issue. Pull requests are not accepted at the moment as I am not able to commit to reviewing them in a timely fashion.
