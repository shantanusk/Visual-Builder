# Visual Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a drag-and-drop visual page builder with no frameworks, no npm — pure HTML/CSS/JS.

**Architecture:** Single-page app with 3 panels (toolbar, canvas, right sidebar). Component registry pattern drives palette rendering, canvas rendering, and property editing. State managed in a simple JavaScript array with undo stack.

**Tech Stack:** Vanilla HTML5, CSS3, JavaScript (ES6+). No dependencies.

## File Structure

```
/var/www/html/vb/
  index.html          # Main HTML shell, loads CSS/JS
  style.css           # All builder UI styles
  app.js              # All application logic
```

---

### Task 1: Project scaffold

**Files:**
- Create: `/var/www/html/vb/index.html`
- Create: `/var/www/html/vb/style.css`
- Create: `/var/www/html/vb/app.js`

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Builder</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <!-- Toolbar -->
    <header id="toolbar">
      <div class="toolbar-left">
        <span class="toolbar-logo">✦ Visual Builder</span>
      </div>
      <div class="toolbar-center">
        <button class="tb-btn active" data-view="desktop" title="Desktop">🖥</button>
        <button class="tb-btn" data-view="tablet" title="Tablet">📱</button>
        <button class="tb-btn" data-view="mobile" title="Mobile">📟</button>
      </div>
      <div class="toolbar-right">
        <button class="tb-btn" id="undoBtn" title="Undo (Ctrl+Z)">↩</button>
        <button class="tb-btn" id="duplicateBtn" title="Duplicate (Ctrl+D)">⧉</button>
        <button class="tb-btn" id="deleteBtn" title="Delete (Delete)">✕</button>
        <button class="tb-btn" id="clearBtn" title="Clear canvas">🗑</button>
        <button class="tb-btn tb-btn-primary" id="exportBtn">Export</button>
      </div>
    </header>

    <!-- Main layout -->
    <div id="main">
      <!-- Canvas -->
      <div id="canvas-area">
        <div id="canvas-wrapper">
          <div id="canvas">
            <div class="canvas-empty">Drag components here or click from the palette</div>
          </div>
        </div>
      </div>

      <!-- Right sidebar -->
      <aside id="sidebar">
        <div class="sidebar-tabs">
          <button class="sidebar-tab active" data-tab="palette">Components</button>
          <button class="sidebar-tab" data-tab="props">Properties</button>
        </div>
        <div class="sidebar-content">
          <div class="tab-panel active" id="tab-palette">
            <!-- palette rendered by JS -->
          </div>
          <div class="tab-panel" id="tab-props">
            <div class="props-empty">Select a component to edit</div>
          </div>
        </div>
      </aside>
    </div>
  </div>

  <!-- Export modal -->
  <div id="export-modal" class="modal-overlay hidden">
    <div class="modal">
      <div class="modal-header">
        <h3>Export</h3>
        <button class="modal-close" id="exportClose">&times;</button>
      </div>
      <div class="modal-body">
        <div class="export-options">
          <label><input type="radio" name="exportMode" value="full" checked> Full HTML page</label>
          <label><input type="radio" name="exportMode" value="snippet"> HTML snippet</label>
        </div>
        <textarea id="exportOutput" readonly rows="12"></textarea>
        <button id="copyBtn" class="btn">Copy to clipboard</button>
      </div>
    </div>
  </div>

  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `style.css` with empty rulesets**

```css
/* style.css — Visual Builder styles */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #1a1a2e;
  color: #e0e0e0;
  overflow: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* === Toolbar === */
#toolbar {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 48px;
  background: #16213e;
  border-bottom: 1px solid #0f3460;
  gap: 12px;
  flex-shrink: 0;
}

.toolbar-logo {
  font-weight: 700;
  font-size: 15px;
  color: #e94560;
  letter-spacing: 0.5px;
}

.toolbar-left,
.toolbar-center,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toolbar-center { flex: 1; justify-content: center; }
.toolbar-right { margin-left: auto; }

.tb-btn {
  background: transparent;
  border: 1px solid #0f3460;
  color: #a0a0b0;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}
.tb-btn:hover { background: #0f3460; color: #fff; }
.tb-btn.active { background: #e94560; color: #fff; border-color: #e94560; }
.tb-btn-primary { background: #e94560; color: #fff; border-color: #e94560; font-weight: 600; }
.tb-btn-primary:hover { background: #d63851; }

/* === Main layout === */
#main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* === Canvas === */
#canvas-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 24px;
  overflow: auto;
  background: #12122a;
}

#canvas-wrapper {
  width: 100%;
  max-width: 960px;
  transition: max-width 0.3s;
  background: #ffffff;
  border-radius: 4px;
  min-height: 400px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
}

#canvas {
  min-height: 400px;
  padding: 0;
  position: relative;
  color: #333;
}

.canvas-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #aaa;
  font-size: 15px;
  user-select: none;
}

/* === Sidebar === */
#sidebar {
  width: 280px;
  flex-shrink: 0;
  background: #16213e;
  border-left: 1px solid #0f3460;
  display: flex;
  flex-direction: column;
}

.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid #0f3460;
}

.sidebar-tab {
  flex: 1;
  padding: 10px;
  background: transparent;
  border: none;
  color: #a0a0b0;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.15s;
}
.sidebar-tab:hover { color: #fff; background: #0f3460; }
.sidebar-tab.active { color: #e94560; border-bottom: 2px solid #e94560; }

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.tab-panel { display: none; }
.tab-panel.active { display: block; }

.props-empty {
  color: #666;
  font-size: 13px;
  padding: 20px 0;
  text-align: center;
}

/* === Palette === */
.palette-group { margin-bottom: 16px; }
.palette-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: #e94560;
  letter-spacing: 1px;
  margin-bottom: 8px;
}
.palette-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.palette-item {
  background: #1a1a2e;
  border: 1px solid #0f3460;
  border-radius: 4px;
  padding: 10px 8px;
  text-align: center;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
  color: #c0c0d0;
  user-select: none;
}
.palette-item:hover { background: #0f3460; border-color: #e94560; color: #fff; }
.palette-item .pi-icon { font-size: 18px; display: block; margin-bottom: 4px; }

/* === Canvas components === */
.canvas-component {
  position: relative;
  cursor: pointer;
  outline: 2px solid transparent;
  transition: outline 0.15s;
}
.canvas-component:hover { outline-color: #4a9eff44; }
.canvas-component.selected { outline-color: #4a9eff; }
.canvas-component.dragging { opacity: 0.4; }
.canvas-component.drag-over { outline-color: #e94560; outline-style: dashed; }

/* === Properties panel === */
.prop-group { margin-bottom: 14px; }
.prop-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #a0a0b0;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.prop-input,
.prop-select,
.prop-textarea {
  width: 100%;
  padding: 6px 8px;
  background: #1a1a2e;
  border: 1px solid #0f3460;
  border-radius: 3px;
  color: #e0e0e0;
  font-size: 13px;
  font-family: inherit;
}
.prop-input:focus,
.prop-select:focus,
.prop-textarea:focus {
  outline: none;
  border-color: #e94560;
}
.prop-textarea { resize: vertical; min-height: 60px; }
.prop-color { width: 100%; height: 32px; padding: 2px; background: #1a1a2e; border: 1px solid #0f3460; border-radius: 3px; cursor: pointer; }

/* === Modal === */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-overlay.hidden { display: none; }
.modal {
  background: #16213e;
  border: 1px solid #0f3460;
  border-radius: 8px;
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #0f3460;
}
.modal-header h3 { font-size: 16px; color: #fff; }
.modal-close { background: none; border: none; color: #888; font-size: 22px; cursor: pointer; }
.modal-close:hover { color: #fff; }
.modal-body { padding: 16px; flex: 1; }
.export-options { display: flex; gap: 16px; margin-bottom: 12px; }
.export-options label { font-size: 13px; color: #c0c0d0; cursor: pointer; }
#exportOutput {
  width: 100%;
  background: #1a1a2e;
  border: 1px solid #0f3460;
  border-radius: 4px;
  color: #e0e0e0;
  padding: 10px;
  font-family: "SF Mono", "Fira Code", monospace;
  font-size: 12px;
  resize: vertical;
}
.btn {
  background: #e94560;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  margin-top: 8px;
  font-weight: 600;
}
.btn:hover { background: #d63851; }
```

- [ ] **Step 3: Create `app.js` with initial state structure**

```javascript
// app.js — Visual Builder

// === State ===
let canvas = [];
let selectedId = null;
let undoStack = [];
let idCounter = 0;

const VIEWS = { desktop: '100%', tablet: '768px', mobile: '375px' };
let currentView = 'desktop';

// === DOM refs ===
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const canvasEl = $('#canvas');
const canvasWrapper = $('#canvas-wrapper');
const tabPalette = $('#tab-palette');
const tabProps = $('#tab-props');

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
  renderPalette();
  setupToolbar();
  setupTabs();
  setupExport();
  renderCanvas();
  setupKeyboard();
});
```

- [ ] **Step 4: Verify page loads without errors**

Run: Open `/var/www/html/vb/index.html` in browser or check with `python3 -m http.server 8080`

---

### Task 2: Component registry

**Files:**
- Modify: `/var/www/html/vb/app.js`

- [ ] **Step 1: Define the component registry with all types**

Append to `app.js` before the state section:

```javascript
// === Component Registry ===
const REGISTRY = {
  // Layout
  container: {
    category: 'layout', label: 'Container', icon: '▣',
    defaultProps: { maxWidth: '960px', padding: '20px', background: '#ffffff' },
    template: (p) => `<div class="comp-container" style="max-width:${p.maxWidth};margin:0 auto;padding:${p.padding};background:${p.background};">\n  <p style="color:#999;">Container content</p>\n</div>`,
    propsConfig: [
      { key: 'maxWidth', label: 'Max Width', type: 'text' },
      { key: 'padding', label: 'Padding', type: 'text' },
      { key: 'background', label: 'Background', type: 'color' }
    ]
  },
  section: {
    category: 'layout', label: 'Section', icon: '▬',
    defaultProps: { padding: '60px 20px', background: '#f8f9fa' },
    template: (p) => `<section class="comp-section" style="padding:${p.padding};background:${p.background};text-align:center;">\n  <h2 style="margin:0 0 12px;font-size:28px;">Section Title</h2>\n  <p style="color:#666;">Section content goes here.</p>\n</section>`,
    propsConfig: [
      { key: 'padding', label: 'Padding', type: 'text' },
      { key: 'background', label: 'Background', type: 'color' }
    ]
  },
  columns2: {
    category: 'layout', label: '2 Columns', icon: '▌▐',
    defaultProps: { gap: '20px', padding: '20px' },
    template: (p) => `<div class="comp-columns" style="display:grid;grid-template-columns:1fr 1fr;gap:${p.gap};padding:${p.padding};background:#fff;">\n  <div style="padding:12px;background:#f0f0f0;border-radius:4px;"><p style="color:#888;">Column 1</p></div>\n  <div style="padding:12px;background:#f0f0f0;border-radius:4px;"><p style="color:#888;">Column 2</p></div>\n</div>`,
    propsConfig: [
      { key: 'gap', label: 'Gap', type: 'text' },
      { key: 'padding', label: 'Padding', type: 'text' }
    ]
  },
  columns3: {
    category: 'layout', label: '3 Columns', icon: '≡',
    defaultProps: { gap: '16px', padding: '20px' },
    template: (p) => `<div class="comp-columns" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:${p.gap};padding:${p.padding};background:#fff;">\n  <div style="padding:12px;background:#f0f0f0;border-radius:4px;"><p style="color:#888;">Col 1</p></div>\n  <div style="padding:12px;background:#f0f0f0;border-radius:4px;"><p style="color:#888;">Col 2</p></div>\n  <div style="padding:12px;background:#f0f0f0;border-radius:4px;"><p style="color:#888;">Col 3</p></div>\n</div>`,
    propsConfig: [
      { key: 'gap', label: 'Gap', type: 'text' },
      { key: 'padding', label: 'Padding', type: 'text' }
    ]
  },
  header: {
    category: 'layout', label: 'Header', icon: '⊞',
    defaultProps: { brand: 'Logo', bgColor: '#2c3e50', textColor: '#ffffff' },
    template: (p) => `<header class="comp-header" style="background:${p.bgColor};color:${p.textColor};padding:12px 24px;display:flex;align-items:center;justify-content:space-between;">\n  <strong style="font-size:18px;">${p.brand}</strong>\n  <nav style="display:flex;gap:16px;">\n    <a href="#" style="color:${p.textColor};text-decoration:none;font-size:14px;">Home</a>\n    <a href="#" style="color:${p.textColor};text-decoration:none;font-size:14px;">About</a>\n    <a href="#" style="color:${p.textColor};text-decoration:none;font-size:14px;">Contact</a>\n  </nav>\n</header>`,
    propsConfig: [
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'bgColor', label: 'Background', type: 'color' },
      { key: 'textColor', label: 'Text Color', type: 'color' }
    ]
  },
  footer: {
    category: 'layout', label: 'Footer', icon: '⊟',
    defaultProps: { text: '© 2026 All rights reserved.', bgColor: '#2c3e50', textColor: '#ffffff' },
    template: (p) => `<footer class="comp-footer" style="background:${p.bgColor};color:${p.textColor};padding:24px;text-align:center;font-size:14px;">\n  ${p.text}\n</footer>`,
    propsConfig: [
      { key: 'text', label: 'Text', type: 'text' },
      { key: 'bgColor', label: 'Background', type: 'color' },
      { key: 'textColor', label: 'Text Color', type: 'color' }
    ]
  },

  // UI Elements
  button: {
    category: 'ui', label: 'Button', icon: '▢',
    defaultProps: { text: 'Click Me', variant: '#e94560', size: '14px', fullWidth: false },
    template: (p) => `<div style="padding:8px;text-align:center;"><button class="comp-button" style="background:${p.variant};color:#fff;border:none;padding:${p.size === '16px' ? '12px 24px' : p.size === '12px' ? '4px 12px' : '8px 20px'};font-size:${p.size};border-radius:4px;cursor:pointer;${p.fullWidth ? 'width:100%;' : ''}font-weight:600;">${p.text}</button></div>`,
    propsConfig: [
      { key: 'text', label: 'Text', type: 'text' },
      { key: 'variant', label: 'Color', type: 'color' },
      { key: 'size', label: 'Size', type: 'select', options: ['12px', '14px', '16px'] },
      { key: 'fullWidth', label: 'Full Width', type: 'checkbox' }
    ]
  },
  card: {
    category: 'ui', label: 'Card', icon: '◻',
    defaultProps: { title: 'Card Title', text: 'Some quick example text for this card.', btnText: 'Learn More', accentColor: '#e94560' },
    template: (p) => `<div class="comp-card" style="border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;margin:12px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.06);">\n  <div style="height:120px;background:${p.accentColor}22;display:flex;align-items:center;justify-content:center;color:${p.accentColor};font-size:32px;">📷</div>\n  <div style="padding:16px;">\n    <h3 style="margin:0 0 8px;font-size:18px;">${p.title}</h3>\n    <p style="color:#666;font-size:14px;line-height:1.5;">${p.text}</p>\n    <button style="margin-top:12px;background:${p.accentColor};color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">${p.btnText}</button>\n  </div>\n</div>`,
    propsConfig: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'text', label: 'Text', type: 'textarea' },
      { key: 'btnText', label: 'Button Text', type: 'text' },
      { key: 'accentColor', label: 'Accent Color', type: 'color' }
    ]
  },
  alert: {
    category: 'ui', label: 'Alert', icon: '⚠',
    defaultProps: { message: 'This is an alert message!', type: '#e94560', dismissible: false },
    template: (p) => `<div class="comp-alert" style="background:${p.type}16;border:1px solid ${p.type};border-radius:4px;padding:12px 16px;margin:8px 12px;color:#333;font-size:14px;display:flex;align-items:center;justify-content:space-between;">\n  <span>${p.message}</span>\n  ${p.dismissible ? '<button style="background:none;border:none;font-size:18px;cursor:pointer;color:#999;">&times;</button>' : ''}\n</div>`,
    propsConfig: [
      { key: 'message', label: 'Message', type: 'text' },
      { key: 'type', label: 'Color', type: 'color' },
      { key: 'dismissible', label: 'Dismissible', type: 'checkbox' }
    ]
  },
  badge: {
    category: 'ui', label: 'Badge', icon: '◆',
    defaultProps: { text: 'New', color: '#e94560' },
    template: (p) => `<div style="padding:8px 12px;"><span class="comp-badge" style="background:${p.color};color:#fff;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:600;display:inline-block;">${p.text}</span></div>`,
    propsConfig: [
      { key: 'text', label: 'Text', type: 'text' },
      { key: 'color', label: 'Color', type: 'color' }
    ]
  },
  divider: {
    category: 'ui', label: 'Divider', icon: '—',
    defaultProps: { color: '#e0e0e0', thickness: '1px', margin: '16px 12px' },
    template: (p) => `<hr class="comp-divider" style="border:none;border-top:${p.thickness} solid ${p.color};margin:${p.margin};">`,
    propsConfig: [
      { key: 'color', label: 'Color', type: 'color' },
      { key: 'thickness', label: 'Thickness', type: 'text' },
      { key: 'margin', label: 'Margin', type: 'text' }
    ]
  },
  list: {
    category: 'ui', label: 'List', icon: '☰',
    defaultProps: { items: 'Item 1\nItem 2\nItem 3', ordered: false },
    template: (p) => {
      const items = p.items.split('\n').map(i => i.trim()).filter(Boolean);
      const tag = p.ordered ? 'ol' : 'ul';
      const lis = items.map(i => `<li style="padding:4px 0;font-size:14px;color:#444;">${i}</li>`).join('\n    ');
      return `<${tag} class="comp-list" style="margin:12px 24px;padding-left:20px;">\n    ${lis}\n  </${tag}>`;
    },
    propsConfig: [
      { key: 'items', label: 'Items (one per line)', type: 'textarea' },
      { key: 'ordered', label: 'Ordered', type: 'checkbox' }
    ]
  },

  // Content Sections
  hero: {
    category: 'content', label: 'Hero', icon: ⬡,
    defaultProps: { heading: 'Build Something Amazing', subtitle: 'Create beautiful pages with our drag-and-drop builder.', ctaText: 'Get Started', bgColor: '#1a1a2e', textColor: '#ffffff', align: 'center' },
    template: (p) => `<section class="comp-hero" style="padding:80px 24px;background:${p.bgColor};text-align:${p.align};color:${p.textColor};">
  <h1 style="font-size:42px;margin:0 0 16px;font-weight:800;line-height:1.2;">${p.heading}</h1>
  <p style="font-size:18px;margin:0 auto 24px;max-width:600px;opacity:0.85;line-height:1.6;">${p.subtitle}</p>
  <button style="background:${p.textColor};color:${p.bgColor};border:none;padding:14px 32px;border-radius:4px;font-size:16px;font-weight:700;cursor:pointer;">${p.ctaText}</button>
</section>`,
    propsConfig: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'ctaText', label: 'Button Text', type: 'text' },
      { key: 'bgColor', label: 'Background', type: 'color' },
      { key: 'textColor', label: 'Text Color', type: 'color' },
      { key: 'align', label: 'Alignment', type: 'select', options: ['left', 'center', 'right'] }
    ]
  },
  features: {
    category: 'content', label: 'Features', icon: '⊞',
    defaultProps: { heading: 'Features', feature1: 'Fast', desc1: 'Lightning quick performance.', feature2: 'Simple', desc2: 'Easy to use interface.', feature3: 'Powerful', desc3: 'Do more with less effort.' },
    template: (p) => `<section class="comp-features" style="padding:60px 24px;background:#f8f9fa;text-align:center;">
  <h2 style="margin:0 0 40px;font-size:32px;color:#222;">${p.heading}</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:900px;margin:0 auto;">
    <div style="background:#fff;padding:24px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <div style="font-size:32px;margin-bottom:12px;">⚡</div>
      <h3 style="margin:0 0 8px;font-size:18px;color:#333;">${p.feature1}</h3>
      <p style="color:#666;font-size:14px;line-height:1.5;">${p.desc1}</p>
    </div>
    <div style="background:#fff;padding:24px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <div style="font-size:32px;margin-bottom:12px;">🎯</div>
      <h3 style="margin:0 0 8px;font-size:18px;color:#333;">${p.feature2}</h3>
      <p style="color:#666;font-size:14px;line-height:1.5;">${p.desc2}</p>
    </div>
    <div style="background:#fff;padding:24px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <div style="font-size:32px;margin-bottom:12px;">🚀</div>
      <h3 style="margin:0 0 8px;font-size:18px;color:#333;">${p.feature3}</h3>
      <p style="color:#666;font-size:14px;line-height:1.5;">${p.desc3}</p>
    </div>
  </div>
</section>`,
    propsConfig: [
      { key: 'heading', label: 'Section Heading', type: 'text' },
      { key: 'feature1', label: 'Feature 1 Name', type: 'text' },
      { key: 'desc1', label: 'Feature 1 Desc', type: 'text' },
      { key: 'feature2', label: 'Feature 2 Name', type: 'text' },
      { key: 'desc2', label: 'Feature 2 Desc', type: 'text' },
      { key: 'feature3', label: 'Feature 3 Name', type: 'text' },
      { key: 'desc3', label: 'Feature 3 Desc', type: 'text' }
    ]
  },
  pricing: {
    category: 'content', label: 'Pricing', icon: '$',
    defaultProps: { plan: 'Pro', price: '$29', period: '/mo', feature1: '10 projects', feature2: 'Unlimited pages', feature3: 'Priority support', ctaText: 'Choose Plan', accentColor: '#e94560' },
    template: (p) => `<section style="padding:60px 24px;background:#fff;text-align:center;">
  <div style="max-width:340px;margin:0 auto;border:2px solid ${p.accentColor};border-radius:12px;padding:32px;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
    <h3 style="margin:0 0 8px;font-size:20px;color:#333;">${p.plan}</h3>
    <div style="font-size:44px;font-weight:800;color:#222;">${p.price}<span style="font-size:16px;font-weight:400;color:#888;">${p.period}</span></div>
    <ul style="list-style:none;padding:0;margin:24px 0;text-align:left;">
      <li style="padding:8px 0;font-size:14px;color:#555;">✓ ${p.feature1}</li>
      <li style="padding:8px 0;font-size:14px;color:#555;">✓ ${p.feature2}</li>
      <li style="padding:8px 0;font-size:14px;color:#555;">✓ ${p.feature3}</li>
    </ul>
    <button style="width:100%;background:${p.accentColor};color:#fff;border:none;padding:12px;border-radius:4px;font-size:15px;font-weight:700;cursor:pointer;">${p.ctaText}</button>
  </div>
</section>`,
    propsConfig: [
      { key: 'plan', label: 'Plan Name', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'period', label: 'Period', type: 'text' },
      { key: 'feature1', label: 'Feature 1', type: 'text' },
      { key: 'feature2', label: 'Feature 2', type: 'text' },
      { key: 'feature3', label: 'Feature 3', type: 'text' },
      { key: 'ctaText', label: 'Button Text', type: 'text' },
      { key: 'accentColor', label: 'Accent Color', type: 'color' }
    ]
  },
  testimonial: {
    category: 'content', label: 'Testimonial', icon: '"',
    defaultProps: { quote: 'This is the best product we have ever used. Highly recommended!', author: 'Jane Doe', role: 'CEO, Company Inc.' },
    template: (p) => `<div style="padding:32px 24px;background:#f8f9fa;text-align:center;margin:8px 12px;border-radius:8px;">
  <div style="font-size:36px;color:#ddd;margin-bottom:8px;">❝</div>
  <blockquote style="font-size:16px;font-style:italic;color:#555;max-width:500px;margin:0 auto 16px;line-height:1.6;">${p.quote}</blockquote>
  <strong style="font-size:14px;color:#333;">${p.author}</strong>
  <div style="font-size:13px;color:#888;">${p.role}</div>
</div>`,
    propsConfig: [
      { key: 'quote', label: 'Quote', type: 'textarea' },
      { key: 'author', label: 'Author', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' }
    ]
  },
  contact: {
    category: 'content', label: 'Contact Form', icon: '✉',
    defaultProps: { email: 'hello@example.com', btnText: 'Send Message', accentColor: '#e94560' },
    template: (p) => `<section style="padding:40px 24px;background:#fff;">
  <form style="max-width:500px;margin:0 auto;">
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:13px;font-weight:600;color:#555;margin-bottom:4px;">Name</label>
      <input type="text" placeholder="Your name" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:4px;font-size:14px;">
    </div>
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:13px;font-weight:600;color:#555;margin-bottom:4px;">Email</label>
      <input type="email" placeholder="${p.email}" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:4px;font-size:14px;">
    </div>
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:13px;font-weight:600;color:#555;margin-bottom:4px;">Message</label>
      <textarea rows="4" placeholder="Your message" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:4px;font-size:14px;resize:vertical;"></textarea>
    </div>
    <button type="submit" style="background:${p.accentColor};color:#fff;border:none;padding:12px 24px;border-radius:4px;font-size:15px;font-weight:600;cursor:pointer;">${p.btnText}</button>
  </form>
</section>`,
    propsConfig: [
      { key: 'email', label: 'Placeholder Email', type: 'text' },
      { key: 'btnText', label: 'Button Text', type: 'text' },
      { key: 'accentColor', label: 'Accent Color', type: 'color' }
    ]
  },

  // Typography
  heading: {
    category: 'typography', label: 'Heading', icon: 'H',
    defaultProps: { text: 'Heading Text', level: 'h2', align: 'left', color: '#222' },
    template: (p) => {
      const sizes = { h1: '36px', h2: '28px', h3: '22px', h4: '18px', h5: '16px', h6: '14px' };
      return `<${p.level} class="comp-heading" style="margin:12px 16px;font-size:${sizes[p.level] || '28px'};text-align:${p.align};color:${p.color};font-weight:700;line-height:1.3;">${p.text}</${p.level}>`;
    },
    propsConfig: [
      { key: 'text', label: 'Text', type: 'text' },
      { key: 'level', label: 'Level', type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
      { key: 'align', label: 'Alignment', type: 'select', options: ['left', 'center', 'right'] },
      { key: 'color', label: 'Color', type: 'color' }
    ]
  },
  paragraph: {
    category: 'typography', label: 'Paragraph', icon: 'P',
    defaultProps: { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.', align: 'left', color: '#444', size: '15px' },
    template: (p) => `<p class="comp-paragraph" style="margin:8px 16px;font-size:${p.size};text-align:${p.align};color:${p.color};line-height:1.6;">${p.text}</p>`,
    propsConfig: [
      { key: 'text', label: 'Text', type: 'textarea' },
      { key: 'align', label: 'Alignment', type: 'select', options: ['left', 'center', 'right', 'justify'] },
      { key: 'color', label: 'Color', type: 'color' },
      { key: 'size', label: 'Size', type: 'select', options: ['13px', '14px', '15px', '16px', '18px'] }
    ]
  },
  blockquote: {
    category: 'typography', label: 'Blockquote', icon: '❝',
    defaultProps: { text: 'The only way to do great work is to love what you do.', cite: 'Steve Jobs', borderColor: '#e94560' },
    template: (p) => `<blockquote class="comp-blockquote" style="margin:16px 24px;padding:12px 16px;border-left:4px solid ${p.borderColor};background:#f9f9f9;border-radius:0 4px 4px 0;">
  <p style="font-style:italic;font-size:15px;color:#555;line-height:1.6;margin:0 0 8px;">"${p.text}"</p>
  <cite style="font-size:13px;color:#888;font-style:normal;">— ${p.cite}</cite>
</blockquote>`,
    propsConfig: [
      { key: 'text', label: 'Quote', type: 'textarea' },
      { key: 'cite', label: 'Citation', type: 'text' },
      { key: 'borderColor', label: 'Border Color', type: 'color' }
    ]
  },
  code: {
    category: 'typography', label: 'Code Block', icon: '<>',
    defaultProps: { code: 'const greeting = "Hello World";\nconsole.log(greeting);', language: 'javascript' },
    template: (p) => `<pre class="comp-code" style="margin:12px 16px;padding:16px;background:#1e1e2e;color:#cdd6f4;border-radius:6px;font-family:'SF Mono','Fira Code',monospace;font-size:13px;line-height:1.5;overflow-x:auto;"><code>${p.code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`,
    propsConfig: [
      { key: 'code', label: 'Code', type: 'textarea' },
      { key: 'language', label: 'Language', type: 'text' }
    ]
  }
};

// Group registry by category
const CATEGORIES = {
  layout: { label: 'Layout', icon: '⊞' },
  ui: { label: 'UI Elements', icon: '▣' },
  content: { label: 'Content Sections', icon: '◈' },
  typography: { label: 'Typography', icon: 'T' }
};
```

- [ ] **Step 2: Verify no syntax errors**

Run: `node -c /var/www/html/vb/app.js`
Expected: `Syntax OK`

---

### Task 3: Palette rendering

**Files:**
- Modify: `/var/www/html/vb/app.js`

- [ ] **Step 1: Implement `renderPalette` and `addComponent`**

Replace the placeholder `// === Initialize ===` section and add these functions:

```javascript
// === Palette ===
function renderPalette() {
  let html = '';
  for (const [catKey, cat] of Object.entries(CATEGORIES)) {
    html += `<div class="palette-group"><div class="palette-group-title">${cat.label}</div><div class="palette-grid">`;
    for (const [typeKey, comp] of Object.entries(REGISTRY)) {
      if (comp.category === catKey) {
        html += `<div class="palette-item" data-type="${typeKey}"><span class="pi-icon">${comp.icon}</span>${comp.label}</div>`;
      }
    }
    html += `</div></div>`;
  }
  tabPalette.innerHTML = html;

  tabPalette.addEventListener('click', (e) => {
    const item = e.target.closest('.palette-item');
    if (item) addComponent(item.dataset.type);
  });
}

function addComponent(type) {
  const comp = REGISTRY[type];
  if (!comp) return;
  const state = {
    id: 'comp_' + (++idCounter),
    type: type,
    props: { ...comp.defaultProps }
  };
  pushUndo();
  canvas.push(state);
  renderCanvas();
  selectComponent(state.id);
}
```

- [ ] **Step 2: Implement `renderCanvas` and `selectComponent`**

```javascript
// === Canvas ===
function renderCanvas() {
  if (canvas.length === 0) {
    canvasEl.innerHTML = '<div class="canvas-empty">Drag components here or click from the palette</div>';
    return;
  }
  let html = '';
  for (const comp of canvas) {
    const entry = REGISTRY[comp.type];
    if (!entry) continue;
    html += `<div class="canvas-component${comp.id === selectedId ? ' selected' : ''}" data-id="${comp.id}" draggable="true">${entry.template(comp.props)}</div>`;
  }
  canvasEl.innerHTML = html;
  attachCanvasEvents();
}

function attachCanvasEvents() {
  // Selection
  canvasEl.querySelectorAll('.canvas-component').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.canvas-component')) {
        selectComponent(el.dataset.id);
      }
    });
  });

  // Drag events
  canvasEl.querySelectorAll('.canvas-component').forEach(el => {
    el.addEventListener('dragstart', handleDragStart);
    el.addEventListener('dragend', handleDragEnd);
    el.addEventListener('dragover', handleDragOver);
    el.addEventListener('dragleave', handleDragLeave);
    el.addEventListener('drop', handleDrop);
  });
}

function selectComponent(id) {
  selectedId = id;
  renderCanvas();
  renderProps();
}
```

- [ ] **Step 3: Verify palette renders and click-add works**

Run: Open the page, click "Button" in palette → should appear on canvas.

---

### Task 4: Properties panel

**Files:**
- Modify: `/var/www/html/vb/app.js`

- [ ] **Step 1: Implement `renderProps`**

```javascript
// === Properties ===
function renderProps() {
  const comp = canvas.find(c => c.id === selectedId);
  if (!comp) {
    tabProps.innerHTML = '<div class="props-empty">Select a component to edit</div>';
    return;
  }
  const entry = REGISTRY[comp.type];
  if (!entry) return;

  let html = '';
  for (const cfg of entry.propsConfig) {
    html += `<div class="prop-group">`;
    html += `<label class="prop-label">${cfg.label}</label>`;
    const val = comp.props[cfg.key] ?? '';
    switch (cfg.type) {
      case 'text':
        html += `<input class="prop-input" type="text" data-key="${cfg.key}" value="${escapeHtml(String(val))}">`;
        break;
      case 'textarea':
        html += `<textarea class="prop-textarea" data-key="${cfg.key}">${escapeHtml(String(val))}</textarea>`;
        break;
      case 'color':
        html += `<input class="prop-color" type="color" data-key="${cfg.key}" value="${val || '#000000'}">`;
        break;
      case 'select':
        html += `<select class="prop-select" data-key="${cfg.key}">`;
        for (const opt of cfg.options) {
          html += `<option value="${opt}"${val === opt ? ' selected' : ''}>${opt}</option>`;
        }
        html += `</select>`;
        break;
      case 'checkbox':
        html += `<label style="display:flex;align-items:center;gap:8px;cursor:pointer;color:#c0c0d0;font-size:13px;"><input type="checkbox" data-key="${cfg.key}"${val ? ' checked' : ''}> ${cfg.label}</label>`;
        break;
    }
    html += `</div>`;
  }
  tabProps.innerHTML = html;

  // Bind change events
  tabProps.querySelectorAll('.prop-input, .prop-textarea, .prop-select').forEach(el => {
    el.addEventListener('input', (e) => updateProp(comp.id, e.target.dataset.key, e.target.value));
  });
  tabProps.querySelectorAll('.prop-color').forEach(el => {
    el.addEventListener('input', (e) => updateProp(comp.id, e.target.dataset.key, e.target.value));
  });
  tabProps.querySelectorAll('input[type="checkbox"]').forEach(el => {
    el.addEventListener('change', (e) => updateProp(comp.id, e.target.dataset.key, e.target.checked));
  });
}

function updateProp(id, key, value) {
  const comp = canvas.find(c => c.id === id);
  if (!comp) return;
  pushUndo();
  comp.props[key] = value;
  renderCanvas();
  renderProps();
  // Re-select after re-render
  selectComponent(id);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

- [ ] **Step 2: Verify properties panel updates canvas in real-time**

Run: Click a component on canvas → properties appear → change a value → canvas updates immediately.

---

### Task 5: Delete, duplicate, undo, clear

**Files:**
- Modify: `/var/www/html/vb/app.js`

- [ ] **Step 1: Implement `deleteComponent`, `duplicateComponent`, `undo`, `clearCanvas`**

```javascript
// === Actions ===
function deleteComponent(id) {
  const idx = canvas.findIndex(c => c.id === id);
  if (idx === -1) return;
  pushUndo();
  canvas.splice(idx, 1);
  if (selectedId === id) selectedId = null;
  renderCanvas();
  renderProps();
}

function duplicateComponent(id) {
  const comp = canvas.find(c => c.id === id);
  if (!comp) return;
  pushUndo();
  const clone = {
    id: 'comp_' + (++idCounter),
    type: comp.type,
    props: { ...comp.props }
  };
  const idx = canvas.findIndex(c => c.id === id);
  canvas.splice(idx + 1, 0, clone);
  renderCanvas();
  selectComponent(clone.id);
}

function clearCanvas() {
  if (canvas.length === 0) return;
  pushUndo();
  canvas = [];
  selectedId = null;
  renderCanvas();
  renderProps();
}

// === Undo ===
function pushUndo() {
  undoStack.push(JSON.parse(JSON.stringify(canvas)));
  if (undoStack.length > 50) undoStack.shift();
}

function undo() {
  if (undoStack.length === 0) return;
  canvas = undoStack.pop();
  selectedId = null;
  renderCanvas();
  renderProps();
}
```

- [ ] **Step 2: Wire toolbar buttons**

```javascript
// === Toolbar Setup ===
function setupToolbar() {
  // View toggle
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      canvasWrapper.style.maxWidth = VIEWS[currentView];
    });
  });

  $('#undoBtn').addEventListener('click', undo);
  $('#duplicateBtn').addEventListener('click', () => {
    if (selectedId) duplicateComponent(selectedId);
  });
  $('#deleteBtn').addEventListener('click', () => {
    if (selectedId) deleteComponent(selectedId);
  });
  $('#clearBtn').addEventListener('click', () => {
    if (confirm('Clear the entire canvas?')) clearCanvas();
  });
}
```

- [ ] **Step 3: Setup keyboard shortcuts**

```javascript
// === Keyboard ===
function setupKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
      e.preventDefault();
      deleteComponent(selectedId);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      undo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      if (selectedId) duplicateComponent(selectedId);
    }
  });
}
```

- [ ] **Step 4: Verify delete, duplicate, undo work**

Run: Add components, select one → Delete key removes it. Ctrl+D duplicates. Ctrl+Z undos.

---

### Task 6: Drag-and-drop reorder

**Files:**
- Modify: `/var/www/html/vb/app.js`

- [ ] **Step 1: Implement drag handlers**

```javascript
// === Drag & Drop ===
let dragSrcId = null;

function handleDragStart(e) {
  dragSrcId = this.dataset.id;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', this.dataset.id);
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  document.querySelectorAll('.canvas-component').forEach(el => el.classList.remove('drag-over'));
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const el = e.target.closest('.canvas-component');
  if (el && el.dataset.id !== dragSrcId) {
    document.querySelectorAll('.canvas-component').forEach(c => c.classList.remove('drag-over'));
    el.classList.add('drag-over');
  }
}

function handleDragLeave(e) {
  const el = e.target.closest('.canvas-component');
  if (el) el.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  const target = e.target.closest('.canvas-component');
  if (!target || !dragSrcId || target.dataset.id === dragSrcId) return;

  const fromIdx = canvas.findIndex(c => c.id === dragSrcId);
  const toIdx = canvas.findIndex(c => c.id === target.dataset.id);
  if (fromIdx === -1 || toIdx === -1) return;

  pushUndo();
  const [moved] = canvas.splice(fromIdx, 1);
  canvas.splice(toIdx, 0, moved);
  dragSrcId = null;
  renderCanvas();
  selectComponent(moved.id);
}
```

- [ ] **Step 2: Verify drag reorder works**

Run: Add 2+ components → drag one above/below another → order changes.

---

### Task 7: Tab switching

**Files:**
- Modify: `/var/www/html/vb/app.js`

- [ ] **Step 1: Implement `setupTabs`**

```javascript
// === Tabs ===
function setupTabs() {
  document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });
}
```

- [ ] **Step 2: Click Components tab → palette shows. Click Properties tab → props for selected appear.**

---

### Task 8: Export

**Files:**
- Modify: `/var/www/html/vb/app.js`

- [ ] **Step 1: Implement export functions**

```javascript
// === Export ===
function setupExport() {
  $('#exportBtn').addEventListener('click', showExport);
  $('#exportClose').addEventListener('click', () => $('#export-modal').classList.add('hidden'));
  $('#export-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) $('#export-modal').classList.add('hidden');
  });
  $('#copyBtn').addEventListener('click', () => {
    const ta = $('#exportOutput');
    ta.select();
    navigator.clipboard.writeText(ta.value).then(() => {
      $('#copyBtn').textContent = 'Copied!';
      setTimeout(() => { $('#copyBtn').textContent = 'Copy to clipboard'; }, 2000);
    });
  });
  document.querySelectorAll('input[name="exportMode"]').forEach(r => {
    r.addEventListener('change', generateExport);
  });
}

function showExport() {
  generateExport();
  $('#export-modal').classList.remove('hidden');
}

function generateExport() {
  const mode = document.querySelector('input[name="exportMode"]:checked').value;
  const bodyHtml = canvas.map(comp => {
    const entry = REGISTRY[comp.type];
    return entry ? entry.template(comp.props) : '';
  }).join('\n\n');

  if (mode === 'snippet') {
    $('#exportOutput').value = bodyHtml;
  } else {
    $('#exportOutput').value = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Built with Visual Builder</title>
</head>
<body>
${bodyHtml.split('\n').map(l => '  ' + l).join('\n')}
</body>
</html>`;
  }
}
```

- [ ] **Step 2: Verify export generates correct HTML**

Run: Build a page, click Export → see output. Toggle full/snippet. Click copy.

---

### Task 9: Style polish & final integration

**Files:**
- Modify: `/var/www/html/vb/style.css`
- Modify: `/var/www/html/vb/app.js`

- [ ] **Step 1: Add drag-over highlight animation to CSS**

Append to `style.css`:

```css
/* === Drag animations === */
@keyframes pulse-border {
  0%, 100% { border-color: #e94560; }
  50% { border-color: #ff6b81; }
}
.canvas-component.drag-over {
  outline-color: #e94560;
  outline-style: dashed;
  outline-width: 2px;
  animation: pulse-border 0.8s ease-in-out infinite;
}

/* === Scrollbar === */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #0f3460; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #1a4a7a; }

/* === Responsive canvas === */
#canvas-wrapper.tablet-view { max-width: 768px; }
#canvas-wrapper.mobile-view { max-width: 375px; }
```

- [ ] **Step 2: Final review all functions are connected in app.js init**

Ensure `document.addEventListener('DOMContentLoaded', ...)` calls all setup functions:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  renderPalette();
  setupToolbar();
  setupTabs();
  setupExport();
  setupKeyboard();
  renderCanvas();
});
```

- [ ] **Step 3: Open the page and test the full flow**
  1. Click components from palette → appear on canvas
  2. Click component on canvas → selected, properties appear
  3. Change properties → canvas updates
  4. Drag to reorder
  5. Delete key removes
  6. Ctrl+D duplicates
  7. Ctrl+Z undoes
  8. Toggle desktop/tablet/mobile
  9. Export generates clean HTML
