# Visual Builder — Design Spec

## Overview

A single-page drag-and-drop visual builder. No frameworks, no build tools — pure HTML/CSS/JS. Users click components from a palette to add them to a canvas, rearrange via drag-and-drop, edit properties in a sidebar, and export clean semantic HTML.

## Scope

- Single `index.html` with embedded CSS/JS (or split into `style.css`/`app.js`)
- No npm, no build step, no backend
- No CSS frameworks — pure custom styles
- Export: clean semantic HTML (user brings their own CSS)

## UI Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Toolbar: [Logo] [Desktop|Tablet|Mobile] [Export|Clear|Undo] │
├───────────────────────────────────┬──────────────────────────┤
│                                   │  Right Sidebar (280px)   │
│                                   │  ┌──────────────────────┐│
│     Canvas (full width)           │  │ Components │ Props │  │
│     ┌─────────────────────┐       │  ├──────────────────────┤│
│     │                     │       │  │ (tab content)         ││
│     │  Drop zone          │       │  │                       ││
│     │                     │       │  │                       ││
│     └─────────────────────┘       │  └──────────────────────┘│
│                                   │                          │
└───────────────────────────────────┴──────────────────────────┘
```

- **Toolbar**: Logo, responsive viewport toggle (desktop/tablet/mobile), Export, Clear Canvas, Undo
- **Canvas**: Full-width rendering area; components render with live preview
- **Right sidebar**: 2-tab layout — Components (palette) | Properties (selected component editing)

## Component Palette

### Layout Blocks
Container, Section, Columns (2-col, 3-col, 4-col), Header, Footer

### UI Elements
Button (variants: default, outline, ghost, sizes), Card (image, title, text, button), Alert (info, success, warning, error), Badge, List (ordered, unordered), Divider

### Content Sections
Hero (heading, subtitle, CTA button), Features Grid (icon/heading/text cards), Pricing Table (tier, price, features list, CTA), Testimonials (quote, author, role), Contact Form (name, email, message, submit)

### Typography
Heading (h1-h6), Paragraph, Blockquote, Code Block, Unordered/Ordered List

## Component Registry Design

```javascript
const registry = {
  hero: {
    category: "content",
    label: "Hero Section",
    defaultProps: {
      heading: "Build Something Great",
      subtitle: "Start creating your vision today.",
      ctaText: "Get Started",
      ctaLink: "#",
      background: "#f8f9fa",
      align: "center"
    },
    template(props) { /* returns HTML string */ },
    propsConfig: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      { key: "ctaText", label: "Button Text", type: "text" },
      { key: "background", label: "Background", type: "color" },
      { key: "align", label: "Alignment", type: "select", options: ["left", "center", "right"] }
    ]
  },
  // ... more types
}
```

## Interaction Model

### Adding
- Click a component in the sidebar palette → appends to end of canvas

### Selecting & Editing
- Click a component on canvas → highlighted border
- Properties tab shows type-specific editable fields
- Changes reflect in real-time

### Rearranging
- Drag components on canvas to reorder (native HTML DnD API)
- Visual placeholder during drag

### Delete & Duplicate
- Select → Delete key or toolbar button
- Duplicate via Ctrl+D or toolbar button

### Undo
- Stack tracks: add, delete, duplicate, reorder, property changes

## Data Model

```javascript
// Component state
{
  id: "comp_1701",
  type: "hero",
  category: "content",
  props: {
    heading: "Build Something Great",
    subtitle: "Start creating your vision today.",
    ctaText: "Get Started",
    background: "#1a1a2e",
    align: "center"
  }
}

// Canvas state
canvas: [comp1, comp2, comp3, ...]
```

## Responsive Preview

- Toolbar toggles canvas width: Desktop (100%), Tablet (768px), Mobile (375px)
- CSS max-width + auto margins on canvas wrapper

## Export

### Full HTML Page
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Built with Visual Builder</title>
</head>
<body>
  <!-- rendered components -->
</body>
</html>
```

### HTML Snippet
- Raw concatenated component HTML
- Copy to clipboard button

Both export modes produce clean semantic HTML with no framework dependencies.

## Constraints
- No npm, no build tools, no backend
- No CSS frameworks — pure custom styles
- Vanilla JavaScript
- Modern browser support (Chrome, Firefox, Safari, Edge)
