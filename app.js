// app.js — Visual Builder v5

console.log('app.js v6 loaded');

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

// === Component Registry ===
const REGISTRY = {
  // Layout
  container: {
    category: 'layout', label: 'Container', icon: '▣',
    defaultProps: { maxWidth: '960px', padding: '20px', background: '#ffffff' },
    template: (p, children) => `<div class="comp-container" style="max-width:${p.maxWidth};margin:0 auto;padding:${p.padding};background:${p.background};">
  <div class="component-content">${children || '<p style="color:#999;margin:0;">Container content</p>'}</div>
</div>`,
    propsConfig: [
      { key: 'maxWidth', label: 'Max Width', type: 'text' },
      { key: 'padding', label: 'Padding', type: 'text' },
      { key: 'background', label: 'Background', type: 'color' }
    ]
  },
  section: {
    category: 'layout', label: 'Section', icon: '▬',
    defaultProps: { padding: '60px 20px', background: '#f8f9fa' },
    template: (p, children) => `<section class="comp-section" style="padding:${p.padding};background:${p.background};text-align:center;">
  <div class="component-content">${children || '<h2 style="margin:0 0 12px;font-size:28px;">Section Title</h2><p style="color:#666;margin:0;">Section content goes here.</p>'}</div>
</section>`,
    propsConfig: [
      { key: 'padding', label: 'Padding', type: 'text' },
      { key: 'background', label: 'Background', type: 'color' }
    ]
  },
  columns2: {
    category: 'layout', label: '2 Columns', icon: '▌▐',
    defaultProps: { gap: '20px', padding: '20px' },
    template: (p, children, cols) => `<div class="comp-columns" style="display:grid;grid-template-columns:1fr 1fr;gap:${p.gap};padding:${p.padding};background:#fff;">
  <div data-col="0" style="min-height:40px;">${cols && cols[0] ? cols[0] : '<div style="padding:12px;background:#f0f0f0;border-radius:4px;text-align:center;"><p style="color:#888;margin:0;">Column 1</p></div>'}</div>
  <div data-col="1" style="min-height:40px;">${cols && cols[1] ? cols[1] : '<div style="padding:12px;background:#f0f0f0;border-radius:4px;text-align:center;"><p style="color:#888;margin:0;">Column 2</p></div>'}</div>
</div>`,
    propsConfig: [
      { key: 'gap', label: 'Gap', type: 'text' },
      { key: 'padding', label: 'Padding', type: 'text' }
    ]
  },
  columns3: {
    category: 'layout', label: '3 Columns', icon: '≡',
    defaultProps: { gap: '16px', padding: '20px' },
    template: (p, children, cols) => `<div class="comp-columns" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:${p.gap};padding:${p.padding};background:#fff;">
  <div data-col="0" style="min-height:40px;">${cols && cols[0] ? cols[0] : '<div style="padding:12px;background:#f0f0f0;border-radius:4px;text-align:center;"><p style="color:#888;margin:0;">Col 1</p></div>'}</div>
  <div data-col="1" style="min-height:40px;">${cols && cols[1] ? cols[1] : '<div style="padding:12px;background:#f0f0f0;border-radius:4px;text-align:center;"><p style="color:#888;margin:0;">Col 2</p></div>'}</div>
  <div data-col="2" style="min-height:40px;">${cols && cols[2] ? cols[2] : '<div style="padding:12px;background:#f0f0f0;border-radius:4px;text-align:center;"><p style="color:#888;margin:0;">Col 3</p></div>'}</div>
</div>`,
    propsConfig: [
      { key: 'gap', label: 'Gap', type: 'text' },
      { key: 'padding', label: 'Padding', type: 'text' }
    ]
  },
  header: {
    category: 'layout', label: 'Header', icon: '⊞',
    defaultProps: { brand: 'Logo', bgColor: '#2c3e50', textColor: '#ffffff' },
    template: (p, children) => `<header class="comp-header" style="background:${p.bgColor};color:${p.textColor};padding:12px 24px;display:flex;align-items:center;justify-content:space-between;">
  <strong style="font-size:18px;">${p.brand}</strong>
  <nav style="display:flex;gap:16px;">
    <a href="#" style="color:${p.textColor};text-decoration:none;font-size:14px;">Home</a>
    <a href="#" style="color:${p.textColor};text-decoration:none;font-size:14px;">About</a>
    <a href="#" style="color:${p.textColor};text-decoration:none;font-size:14px;">Contact</a>
  </nav>
  <div class="component-content">${children || ''}</div>
</header>`,
    propsConfig: [
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'bgColor', label: 'Background', type: 'color' },
      { key: 'textColor', label: 'Text Color', type: 'color' }
    ]
  },
  footer: {
    category: 'layout', label: 'Footer', icon: '⊟',
    defaultProps: { text: '© 2026 All rights reserved.', bgColor: '#2c3e50', textColor: '#ffffff' },
    template: (p, children) => `<footer class="comp-footer" style="background:${p.bgColor};color:${p.textColor};padding:24px;text-align:center;font-size:14px;">
  <div class="component-content">${children || p.text}</div>
</footer>`,
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
    template: (p) => `<div class="comp-card" style="border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;margin:12px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
  <div style="height:120px;background:${p.accentColor}22;display:flex;align-items:center;justify-content:center;color:${p.accentColor};font-size:32px;">📷</div>
  <div style="padding:16px;">
    <h3 style="margin:0 0 8px;font-size:18px;">${p.title}</h3>
    <p style="color:#666;font-size:14px;line-height:1.5;">${p.text}</p>
    <button style="margin-top:12px;background:${p.accentColor};color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">${p.btnText}</button>
  </div>
</div>`,
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
    template: (p) => `<div class="comp-alert" style="background:${p.type}16;border:1px solid ${p.type};border-radius:4px;padding:12px 16px;margin:8px 12px;color:#333;font-size:14px;display:flex;align-items:center;justify-content:space-between;">
  <span>${p.message}</span>
  ${p.dismissible ? '<button style="background:none;border:none;font-size:18px;cursor:pointer;color:#999;">&times;</button>' : ''}
</div>`,
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
      return `<${tag} class="comp-list" style="margin:12px 24px;padding-left:20px;">
    ${lis}
  </${tag}>`;
    },
    propsConfig: [
      { key: 'items', label: 'Items (one per line)', type: 'textarea' },
      { key: 'ordered', label: 'Ordered', type: 'checkbox' }
    ]
  },

  // Content Sections
  hero: {
    category: 'content', label: 'Hero', icon: '⬡',
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
  <p style="font-style:italic;font-size:15px;color:#555;line-height:1.6;margin:0 0 8px;">&ldquo;${p.text}&rdquo;</p>
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
  },

  // Navigation
  navbar: {
    category: 'navigation', label: 'Navbar', icon: '≡',
    defaultProps: { brand: 'BrandName', link1: 'Home', link2: 'About', link3: 'Services', link4: 'Contact', bgColor: '#ffffff', textColor: '#333' },
    template: (p) => `<nav class="comp-navbar" style="background:${p.bgColor};color:${p.textColor};padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:60px;border-bottom:1px solid #eee;font-family:sans-serif;">
  <strong style="font-size:20px;font-weight:700;">${p.brand}</strong>
  <div style="display:flex;gap:24px;">
    <a style="color:${p.textColor};text-decoration:none;font-size:14px;font-weight:500;">${p.link1}</a>
    <a style="color:${p.textColor};text-decoration:none;font-size:14px;font-weight:500;">${p.link2}</a>
    <a style="color:${p.textColor};text-decoration:none;font-size:14px;font-weight:500;">${p.link3}</a>
    <a style="color:${p.textColor};text-decoration:none;font-size:14px;font-weight:500;">${p.link4}</a>
  </div>
</nav>`,
    propsConfig: [
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'link1', label: 'Link 1', type: 'text' },
      { key: 'link2', label: 'Link 2', type: 'text' },
      { key: 'link3', label: 'Link 3', type: 'text' },
      { key: 'link4', label: 'Link 4', type: 'text' },
      { key: 'bgColor', label: 'Background', type: 'color' },
      { key: 'textColor', label: 'Text Color', type: 'color' }
    ]
  },

  // Layout extras
  columns4: {
    category: 'layout', label: '4 Columns', icon: '☰',
    defaultProps: { gap: '12px', padding: '20px' },
    template: (p, children, cols) => `<div class="comp-columns4" style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:${p.gap};padding:${p.padding};background:#fff;">
  <div data-col="0" style="min-height:40px;">${cols && cols[0] ? cols[0] : '<div style="padding:10px;background:#f5f5f5;border-radius:4px;text-align:center;font-size:13px;color:#888;">Col 1</div>'}</div>
  <div data-col="1" style="min-height:40px;">${cols && cols[1] ? cols[1] : '<div style="padding:10px;background:#f5f5f5;border-radius:4px;text-align:center;font-size:13px;color:#888;">Col 2</div>'}</div>
  <div data-col="2" style="min-height:40px;">${cols && cols[2] ? cols[2] : '<div style="padding:10px;background:#f5f5f5;border-radius:4px;text-align:center;font-size:13px;color:#888;">Col 3</div>'}</div>
  <div data-col="3" style="min-height:40px;">${cols && cols[3] ? cols[3] : '<div style="padding:10px;background:#f5f5f5;border-radius:4px;text-align:center;font-size:13px;color:#888;">Col 4</div>'}</div>
</div>`,
    propsConfig: [
      { key: 'gap', label: 'Gap', type: 'text' },
      { key: 'padding', label: 'Padding', type: 'text' }
    ]
  },

  // UI extras
  table: {
    category: 'ui', label: 'Table', icon: '⊞',
    defaultProps: { header1: 'Name', header2: 'Email', header3: 'Role', row1: 'John Doe', row1e: 'john@example.com', row1r: 'Admin', row2: 'Jane Smith', row2e: 'jane@example.com', row2r: 'Editor', row3: 'Bob Johnson', row3e: 'bob@example.com', row3r: 'Viewer' },
    template: (p) => `<div style="padding:12px;overflow-x:auto;">
  <table style="width:100%;border-collapse:collapse;font-size:14px;font-family:sans-serif;">
    <thead>
      <tr style="background:#f8f9fa;">
        <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #dee2e6;font-weight:600;color:#333;">${p.header1}</th>
        <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #dee2e6;font-weight:600;color:#333;">${p.header2}</th>
        <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #dee2e6;font-weight:600;color:#333;">${p.header3}</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#555;">${p.row1}</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#555;">${p.row1e}</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#555;">${p.row1r}</td></tr>
      <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#555;">${p.row2}</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#555;">${p.row2e}</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#555;">${p.row2r}</td></tr>
      <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#555;">${p.row3}</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#555;">${p.row3e}</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#555;">${p.row3r}</td></tr>
    </tbody>
  </table>
</div>`,
    propsConfig: [
      { key: 'header1', label: 'Header 1', type: 'text' },
      { key: 'header2', label: 'Header 2', type: 'text' },
      { key: 'header3', label: 'Header 3', type: 'text' },
      { key: 'row1', label: 'Row 1 Col 1', type: 'text' },
      { key: 'row1e', label: 'Row 1 Col 2', type: 'text' },
      { key: 'row1r', label: 'Row 1 Col 3', type: 'text' },
      { key: 'row2', label: 'Row 2 Col 1', type: 'text' },
      { key: 'row2e', label: 'Row 2 Col 2', type: 'text' },
      { key: 'row2r', label: 'Row 2 Col 3', type: 'text' },
      { key: 'row3', label: 'Row 3 Col 1', type: 'text' },
      { key: 'row3e', label: 'Row 3 Col 2', type: 'text' },
      { key: 'row3r', label: 'Row 3 Col 3', type: 'text' }
    ]
  },

  // Content extras
  signature: {
    category: 'content', label: 'Signature', icon: '✍',
    defaultProps: { name: 'Sarah Johnson', title: 'CEO & Founder', text: 'Building the future, one step at a time.', photo: '👩‍💼' },
    template: (p) => `<div style="padding:24px;display:flex;align-items:center;gap:16px;background:#fafafa;margin:8px 12px;border-radius:8px;">
  <div style="font-size:48px;width:64px;height:64px;display:flex;align-items:center;justify-content:center;background:#e94560;color:#fff;border-radius:50%;flex-shrink:0;">${p.photo}</div>
  <div>
    <strong style="font-size:16px;color:#222;display:block;">${p.name}</strong>
    <span style="font-size:13px;color:#e94560;font-weight:600;">${p.title}</span>
    <p style="margin:6px 0 0;font-size:13px;color:#666;line-height:1.4;">${p.text}</p>
  </div>
</div>`,
    propsConfig: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'text', label: 'Description', type: 'text' },
      { key: 'photo', label: 'Photo Emoji', type: 'text' }
    ]
  },
  product: {
    category: 'content', label: 'Product', icon: '🏷',
    defaultProps: { name: 'Premium Widget', price: '$49.99', oldPrice: '$79.99', desc: 'High-quality widget with premium features and lifetime warranty.', badge: 'Sale', btnText: 'Add to Cart', accentColor: '#e94560' },
    template: (p) => `<div style="padding:16px;margin:8px 12px;">
  <div style="border:1px solid #eee;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);max-width:320px;margin:0 auto;background:#fff;">
    <div style="height:160px;background:linear-gradient(135deg,${p.accentColor}22,#f8f9fa);display:flex;align-items:center;justify-content:center;position:relative;">
      <span style="font-size:48px;">📦</span>
      <span style="position:absolute;top:12px;left:12px;background:${p.accentColor};color:#fff;padding:4px 10px;border-radius:4px;font-size:11px;font-weight:700;">${p.badge}</span>
      <span style="position:absolute;top:12px;right:12px;background:#fff;color:#333;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:700;">★ 4.8</span>
    </div>
    <div style="padding:16px;">
      <h3 style="margin:0 0 6px;font-size:17px;color:#222;">${p.name}</h3>
      <div style="margin-bottom:8px;">
        <span style="font-size:22px;font-weight:800;color:${p.accentColor};">${p.price}</span>
        <span style="font-size:14px;color:#999;text-decoration:line-through;margin-left:8px;">${p.oldPrice}</span>
      </div>
      <p style="font-size:13px;color:#666;line-height:1.5;margin:0 0 14px;">${p.desc}</p>
      <button style="width:100%;background:${p.accentColor};color:#fff;border:none;padding:10px;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer;">${p.btnText}</button>
    </div>
  </div>
</div>`,
    propsConfig: [
      { key: 'name', label: 'Product Name', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'oldPrice', label: 'Old Price', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'btnText', label: 'Button Text', type: 'text' },
      { key: 'accentColor', label: 'Accent Color', type: 'color' }
    ]
  },
  form: {
    category: 'content', label: 'Form', icon: '📋',
    defaultProps: { heading: 'Get in Touch', nameLabel: 'Name', emailLabel: 'Email', messageLabel: 'Message', btnText: 'Submit', accentColor: '#e94560' },
    template: (p) => `<section style="padding:40px 24px;background:#fff;">
  <form style="max-width:480px;margin:0 auto;background:#fafafa;padding:28px;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,0.04);">
    <h3 style="margin:0 0 20px;font-size:22px;color:#222;text-align:center;">${p.heading}</h3>
    <div style="margin-bottom:14px;">
      <label style="display:block;font-size:13px;font-weight:600;color:#555;margin-bottom:4px;">${p.nameLabel}</label>
      <input type="text" placeholder="${p.nameLabel}" style="width:100%;padding:10px 14px;border:1px solid #ddd;border-radius:6px;font-size:14px;background:#fff;">
    </div>
    <div style="margin-bottom:14px;">
      <label style="display:block;font-size:13px;font-weight:600;color:#555;margin-bottom:4px;">${p.emailLabel}</label>
      <input type="email" placeholder="${p.emailLabel}" style="width:100%;padding:10px 14px;border:1px solid #ddd;border-radius:6px;font-size:14px;background:#fff;">
    </div>
    <div style="margin-bottom:14px;">
      <label style="display:block;font-size:13px;font-weight:600;color:#555;margin-bottom:4px;">${p.messageLabel}</label>
      <textarea rows="4" placeholder="${p.messageLabel}" style="width:100%;padding:10px 14px;border:1px solid #ddd;border-radius:6px;font-size:14px;resize:vertical;background:#fff;"></textarea>
    </div>
    <button type="submit" style="width:100%;background:${p.accentColor};color:#fff;border:none;padding:12px;border-radius:6px;font-size:15px;font-weight:600;cursor:pointer;">${p.btnText}</button>
  </form>
</section>`,
    propsConfig: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'nameLabel', label: 'Name Label', type: 'text' },
      { key: 'emailLabel', label: 'Email Label', type: 'text' },
      { key: 'messageLabel', label: 'Message Label', type: 'text' },
      { key: 'btnText', label: 'Button Text', type: 'text' },
      { key: 'accentColor', label: 'Accent Color', type: 'color' }
    ]
  }
};

const CATEGORIES = {
  layout: { label: 'Layout', icon: '⊞' },
  navigation: { label: 'Navigation', icon: '☰' },
  ui: { label: 'UI Elements', icon: '▣' },
  content: { label: 'Content Sections', icon: '◈' },
  typography: { label: 'Typography', icon: 'T' }
};

// === Palette ===
function renderPalette(filter) {
  const q = (filter || '').toLowerCase().trim();
  let html = '';
  for (const [catKey, cat] of Object.entries(CATEGORIES)) {
    let catHtml = '';
    for (const [typeKey, comp] of Object.entries(REGISTRY)) {
      if (comp.category === catKey) {
        const label = comp.label.toLowerCase();
        if (!q || label.includes(q)) {
          catHtml += '<div class="palette-item" data-type="' + typeKey + '" draggable="true"><span class="pi-icon">' + comp.icon + '</span>' + comp.label + '</div>';
        }
      }
    }
    if (catHtml) {
      html += '<div class="palette-group"><div class="palette-group-title">' + cat.label + '</div><div class="palette-grid">' + catHtml + '</div></div>';
    }
  }
  document.getElementById('palette-grid-container').innerHTML = html;
}

function setupPaletteSearch() {
  const input = document.getElementById('paletteSearchInput');
  if (input) {
    input.addEventListener('input', function () {
      renderPalette(this.value);
    });
  }
  tabPalette.addEventListener('click', (e) => {
    const item = e.target.closest('.palette-item');
    if (item) addComponent(item.dataset.type);
  });
  tabPalette.addEventListener('dragstart', (e) => {
    const item = e.target.closest('.palette-item');
    if (item) {
      e.dataTransfer.setData('text/x-palette-type', item.dataset.type);
      e.dataTransfer.effectAllowed = 'copy';
    }
  });
}

function addComponent(type, index) {
  const comp = REGISTRY[type];
  if (!comp) return;
  const state = {
    id: 'comp_' + (++idCounter),
    type: type,
    props: Object.assign({}, comp.defaultProps),
    children: []
  };
  const isCol = type === 'columns2' || type === 'columns3' || type === 'columns4';
  if (isCol) {
    const n = type === 'columns2' ? 2 : type === 'columns3' ? 3 : 4;
    state.columns = Array.from({ length: n }, () => ({ children: [] }));
  }
  pushUndo();
  if (index !== undefined && index >= 0 && index <= canvas.length) {
    canvas.splice(index, 0, state);
  } else {
    canvas.push(state);
  }
  renderCanvas();
  selectComponent(state.id);
}

// === Canvas ===
function renderCanvas() {
  console.log('renderCanvas, canvas.length:', canvas.length);
  if (canvas.length === 0) {
    canvasEl.innerHTML = '<div class="canvas-empty">Drag components here or click from the palette</div>';
    return;
  }
  canvasEl.innerHTML = renderComponentList(canvas, 'root');
  attachCanvasEvents();
}

function renderComponentList(list) {
  return list.map(function (comp) { return renderSingleComponent(comp); }).join('\n');
}

function renderSingleComponent(comp) {
  const entry = REGISTRY[comp.type];
  if (!entry) return '';

  let childrenHtml = '';
  if (comp.children && comp.children.length > 0) {
    childrenHtml = '<div class="nested-children">' + renderComponentList(comp.children) + '</div>';
  }

  let columnsHtml = null;
  if (comp.columns) {
    columnsHtml = comp.columns.map(function (col) {
      if (col.children && col.children.length > 0) {
        return '<div class="nested-children column-children">' + renderComponentList(col.children) + '</div>';
      }
      return '';
    });
  }

  return '<div class="canvas-component' + (comp.id === selectedId ? ' selected' : '') + '" data-id="' + comp.id + '" draggable="true">'
    + entry.template(comp.props, childrenHtml, columnsHtml)
    + '</div>';
}

function attachCanvasEvents() {
  canvasEl.querySelectorAll('.canvas-component').forEach(function (el) {
    if (el.dataset.dragAttached) return;
    el.dataset.dragAttached = '1';

    el.addEventListener('click', function (e) {
      selectComponent(this.dataset.id);
    });

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
  // Auto-switch to Properties tab
  document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('.sidebar-tab[data-tab="props"]').classList.add('active');
  document.getElementById('tab-props').classList.add('active');
}

function findComponentById(id, items) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) return items[i];
    if (items[i].children && items[i].children.length > 0) {
      const found = findComponentById(id, items[i].children);
      if (found) return found;
    }
    if (items[i].columns) {
      for (let c = 0; c < items[i].columns.length; c++) {
        const found = findComponentById(id, items[i].columns[c].children);
        if (found) return found;
      }
    }
  }
  return null;
}

// === Properties ===
function renderProps() {
  const comp = findComponentById(selectedId, canvas);
  if (!comp) {
    tabProps.innerHTML = '<div class="props-empty">Select a component to edit</div>';
    return;
  }
  const entry = REGISTRY[comp.type];
  if (!entry) return;

  let html = '';
  for (const cfg of entry.propsConfig) {
    html += '<div class="prop-group">';
    if (cfg.type !== 'checkbox') {
      html += '<label class="prop-label">' + cfg.label + '</label>';
    }
    const val = comp.props[cfg.key] !== undefined ? comp.props[cfg.key] : '';
    switch (cfg.type) {
      case 'text':
        html += '<input class="prop-input" type="text" data-key="' + cfg.key + '" value="' + escapeHtml(String(val)) + '">';
        break;
      case 'textarea':
        html += '<textarea class="prop-textarea" data-key="' + cfg.key + '">' + escapeHtml(String(val)) + '</textarea>';
        break;
      case 'color':
        html += '<input class="prop-color" type="color" data-key="' + cfg.key + '" value="' + (val || '#000000') + '">';
        break;
      case 'select':
        html += '<select class="prop-select" data-key="' + cfg.key + '">';
        for (const opt of cfg.options) {
          html += '<option value="' + opt + '"' + (val === opt ? ' selected' : '') + '>' + opt + '</option>';
        }
        html += '</select>';
        break;
      case 'checkbox':
        html += '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;color:#c0c0d0;font-size:13px;"><input type="checkbox" data-key="' + cfg.key + '"' + (val ? ' checked' : '') + '> ' + cfg.label + '</label>';
        break;
    }
    html += '</div>';
  }
  tabProps.innerHTML = html;

  tabProps.querySelectorAll('.prop-input, .prop-textarea, .prop-select').forEach(el => {
    el.addEventListener('input', function (e) { updateProp(comp.id, this.dataset.key, this.value); });
  });
  tabProps.querySelectorAll('.prop-color').forEach(el => {
    el.addEventListener('input', function (e) { updateProp(comp.id, this.dataset.key, this.value); });
  });
  tabProps.querySelectorAll('input[type="checkbox"]').forEach(el => {
    el.addEventListener('change', function (e) { updateProp(comp.id, this.dataset.key, this.checked); });
  });
}

function updateProp(id, key, value) {
  const comp = findComponentById(id, canvas);
  if (!comp) return;
  pushUndo();
  comp.props[key] = value;
  renderCanvas();
  renderProps();
  if (selectedId === id) {
    const el = canvasEl.querySelector('.canvas-component.selected[data-id="' + id + '"]');
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// === Actions ===
function deleteComponent(id) {
  const found = findInTree(id, canvas);
  if (!found) return;
  pushUndo();
  found.container.splice(found.index, 1);
  if (selectedId === id) selectedId = null;
  renderCanvas();
  renderProps();
}

function duplicateComponent(id) {
  const found = findInTree(id, canvas);
  if (!found) return;
  pushUndo();
  const clone = {
    id: 'comp_' + (++idCounter),
    type: found.component.type,
    props: Object.assign({}, found.component.props),
    children: []
  };
  if (found.component.columns) {
    clone.columns = found.component.columns.map(function (col) {
      return { children: [] };
    });
  }
  found.container.splice(found.index + 1, 0, clone);
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

// === Drag & Drop (Native HTML5) ===
let dragSrcId = null;

function findInTree(id, items) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      return { container: items, index: i, component: items[i] };
    }
    if (items[i].children && items[i].children.length > 0) {
      const found = findInTree(id, items[i].children);
      if (found) return found;
    }
    if (items[i].columns) {
      for (let c = 0; c < items[i].columns.length; c++) {
        const found = findInTree(id, items[i].columns[c].children);
        if (found) {
          found.columnIndex = c;
          found.parentComponent = items[i];
          return found;
        }
      }
    }
  }
  return null;
}

function getDropTargetInfo(e) {
  const comp = e.target.closest('.canvas-component');
  if (!comp) return { type: 'canvas' };
  const compId = comp.dataset.id;

  const colEl = e.target.closest('[data-col]');
  if (colEl) {
    return { type: 'column', componentId: compId, colIndex: parseInt(colEl.dataset.col) };
  }

  const contentEl = e.target.closest('.component-content');
  if (contentEl) {
    return { type: 'child', componentId: compId };
  }

  return { type: 'sibling', componentId: compId };
}

function handleDragStart(e) {
  dragSrcId = this.dataset.id;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', this.dataset.id);
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  dragSrcId = null;
  canvasEl.querySelectorAll('.canvas-component').forEach(el => el.classList.remove('drag-over'));
  canvasEl.querySelectorAll('.component-content').forEach(el => el.classList.remove('drag-over'));
  canvasEl.querySelectorAll('[data-col]').forEach(el => el.classList.remove('drag-over'));
  canvasEl.classList.remove('drag-over');
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const info = getDropTargetInfo(e);
  if (!info || !info.componentId || info.componentId === dragSrcId) return;

  canvasEl.querySelectorAll('.canvas-component').forEach(c => c.classList.remove('drag-over'));
  canvasEl.querySelectorAll('.component-content').forEach(c => c.classList.remove('drag-over'));
  canvasEl.querySelectorAll('[data-col]').forEach(c => c.classList.remove('drag-over'));

  if (info.type === 'column') {
    const colEl = canvasEl.querySelector('[data-col="' + info.colIndex + '"]');
    if (colEl) colEl.classList.add('drag-over');
  } else if (info.type === 'child') {
    const target = canvasEl.querySelector('.canvas-component[data-id="' + info.componentId + '"]');
    if (target) {
      target.classList.add('drag-over');
      const contentEl = target.querySelector('.component-content');
      if (contentEl) contentEl.classList.add('drag-over');
    }
  } else if (info.type === 'sibling') {
    const target = canvasEl.querySelector('.canvas-component[data-id="' + info.componentId + '"]');
    if (target) target.classList.add('drag-over');
  }
}

function handleDragLeave(e) {
  const el = e.target.closest('.canvas-component');
  if (el) el.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  const dropInfo = getDropTargetInfo(e);
  if (!dropInfo || !dragSrcId) return;

  const src = findInTree(dragSrcId, canvas);
  if (!src) { dragSrcId = null; renderCanvas(); return; }

  pushUndo();
  const [moved] = src.container.splice(src.index, 1);

  if (dropInfo.type === 'column') {
    const parentInfo = findInTree(dropInfo.componentId, canvas);
    if (parentInfo && parentInfo.component.columns && parentInfo.component.columns[dropInfo.colIndex]) {
      parentInfo.component.columns[dropInfo.colIndex].children.push(moved);
    } else {
      canvas.push(moved);
    }
  } else if (dropInfo.type === 'child') {
    const parentInfo = findInTree(dropInfo.componentId, canvas);
    if (parentInfo) {
      parentInfo.component.children.push(moved);
    } else {
      canvas.push(moved);
    }
  } else if (dropInfo.type === 'sibling') {
    const tgt = findInTree(dropInfo.componentId, canvas);
    if (tgt) {
      tgt.container.splice(tgt.index, 0, moved);
    } else {
      canvas.push(moved);
    }
  } else {
    canvas.push(moved);
  }

  dragSrcId = null;
  renderCanvas();
  selectComponent(moved.id);
}

// === Tabs ===
function setupTabs() {
  document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      document.getElementById('tab-' + this.dataset.tab).classList.add('active');
    });
  });
}

// === Toolbar Setup ===
function setupToolbar() {
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentView = this.dataset.view;
      canvasWrapper.style.maxWidth = VIEWS[currentView];
    });
  });

  $('#undoBtn').addEventListener('click', undo);
  $('#duplicateBtn').addEventListener('click', function () {
    if (selectedId) duplicateComponent(selectedId);
  });
  $('#deleteBtn').addEventListener('click', function () {
    if (selectedId) deleteComponent(selectedId);
  });
  $('#clearBtn').addEventListener('click', function () {
    if (confirm('Clear the entire canvas?')) clearCanvas();
  });
}

// === Keyboard ===
function setupKeyboard() {
  document.addEventListener('keydown', function (e) {
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

// === Export ===
function setupExport() {
  $('#exportBtn').addEventListener('click', showExport);
  $('#exportClose').addEventListener('click', function () { $('#export-modal').classList.add('hidden'); });
  $('#export-modal').addEventListener('click', function (e) {
    if (e.target === e.currentTarget) $('#export-modal').classList.add('hidden');
  });
  $('#copyBtn').addEventListener('click', function () {
    const ta = $('#exportOutput');
    ta.select();
    navigator.clipboard.writeText(ta.value).then(function () {
      $('#copyBtn').textContent = 'Copied!';
      setTimeout(function () { $('#copyBtn').textContent = 'Copy to clipboard'; }, 2000);
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
  const bodyHtml = canvas.map(function (comp) {
    const entry = REGISTRY[comp.type];
    return entry ? entry.template(comp.props) : '';
  }).join('\n\n');

  if (mode === 'snippet') {
    $('#exportOutput').value = bodyHtml;
  } else {
    $('#exportOutput').value = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Built with Visual Builder</title>\n</head>\n<body>\n' + bodyHtml.split('\n').map(function(l) { return '  ' + l; }).join('\n') + '\n</body>\n</html>';
  }
}

// === Initialize ===
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded fired');
  renderPalette();
  setupPaletteSearch();
  setupToolbar();
  setupTabs();
  setupExport();
  setupKeyboard();
  renderCanvas();

  // Canvas drop zone for palette drags
  canvasEl.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    this.classList.add('drag-over');
  });
  canvasEl.addEventListener('dragleave', function (e) {
    this.classList.remove('drag-over');
  });
  canvasEl.addEventListener('drop', function (e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    const paletteType = e.dataTransfer.getData('text/x-palette-type');
    if (paletteType && REGISTRY[paletteType]) {
      const comp = REGISTRY[paletteType];
      const state = {
        id: 'comp_' + (++idCounter),
        type: paletteType,
        props: Object.assign({}, comp.defaultProps),
        children: []
      };
      const isCol = paletteType === 'columns2' || paletteType === 'columns3' || paletteType === 'columns4';
      if (isCol) {
        const n = paletteType === 'columns2' ? 2 : paletteType === 'columns3' ? 3 : 4;
        state.columns = Array.from({ length: n }, function () { return { children: [] }; });
      }

      pushUndo();
      const info = getDropTargetInfo(e);

      if (info.type === 'column') {
        const parentInfo = findInTree(info.componentId, canvas);
        if (parentInfo && parentInfo.component.columns && parentInfo.component.columns[info.colIndex]) {
          parentInfo.component.columns[info.colIndex].children.push(state);
          renderCanvas();
          selectComponent(state.id);
          return;
        }
      } else if (info.type === 'child') {
        const parentInfo = findInTree(info.componentId, canvas);
        if (parentInfo) {
          parentInfo.component.children.push(state);
          renderCanvas();
          selectComponent(state.id);
          return;
        }
      } else if (info.type === 'sibling') {
        const tgt = findInTree(info.componentId, canvas);
        if (tgt) {
          tgt.container.splice(tgt.index, 0, state);
          renderCanvas();
          selectComponent(state.id);
          return;
        }
      }
      canvas.push(state);
      renderCanvas();
      selectComponent(state.id);
    }
  });
});
