# Visual Builder

A drag-and-drop page builder built with vanilla JavaScript. Design web pages visually with a component palette, live canvas, property editor, and HTML export.

## Features

- Drag-and-drop canvas with 25+ built-in components
- Component palette with search, categorized by type
- Live property editor with color pickers, selects, textareas, and checkboxes
- Nested containers and column layouts (2, 3, 4 columns)
- Multi-viewport preview (desktop, tablet, mobile)
- Undo/redo (Ctrl+Z), duplicate (Ctrl+D), delete (Delete)
- Export to full HTML page or snippet
- No dependencies, no build step

## Usage

Open `index.html` in a browser. Drag components from the right sidebar onto the canvas, or click to add. Select a component to edit its properties. Export your design via the Export button.

## Adding Custom Components

Components are registered in the `REGISTRY` object in `app.js:24-508`. See [docs/INTEGRATION.html](docs/INTEGRATION.html#sec2) for the full guide.

## License

[MIT](LICENSE)
