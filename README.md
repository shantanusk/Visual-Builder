# Visual Builder

A drag-and-drop page builder built with vanilla JavaScript. Design web pages visually with a component palette, live canvas, property editor, and HTML export.

## Features

- Drag-and-drop canvas with 27 built-in components
- Component palette with search, categorized by type (layout, UI, content, typography, navigation)
- Live property editor with color pickers, selects, textareas, and checkboxes
- Nested containers and column layouts (2, 3, 4 columns)
- Multi-viewport preview (desktop, tablet, mobile)
- Undo/redo (Ctrl+Z), duplicate (Ctrl+D), delete (Delete)
- Export to full HTML page or snippet
- Bootstrap 5 integration (standalone demo page)
- No dependencies, no build step

## Usage

Open `index.html` in a browser. Drag components from the right sidebar onto the canvas, or click to add. Select a component to edit its properties. Export your design via the Export button.

## Adding Custom Components

Use `registerComponent(type, definition)` to add components programmatically or from JSON. The `template` accepts:

- **Function** — full control: `(props, children, columns) => html`
- **String** — JSON-friendly with `{{prop}}` and `{{prop:fallback}}` placeholders

Example:
```js
// From JSON
const def = JSON.parse('{"type":"myComp","template":"<div>{{msg}}</div>","defaultProps":{"msg":"Hello"}}');
registerComponent(def.type, def);
```

See [docs/INTEGRATION.html](docs/INTEGRATION.html) for the full guide.

## Bootstrap 5 Integration

Open `integrations/bootstrap.html` for a standalone demo that renders all components with Bootstrap 5.3 classes. Components are automatically swapped when the integration script is loaded after `app.js`.

## Project Structure

```
├── index.html              Main editor page
├── app.js                  Core engine
├── style.css               Editor UI styles
├── LICENSE                 MIT license
├── integrations/
│   ├── bootstrap.html      Bootstrap 5 demo page
│   └── bootstrap.js        Bootstrap component definitions
└── docs/
    └── INTEGRATION.html    Developer integration guide
```

## License

[MIT](LICENSE)
