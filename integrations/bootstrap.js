/* Visual Builder — Bootstrap 5 Integration
   Load this AFTER app.js to swap all components to Bootstrap 5 markup. */

(function () {

var BS = {};

// ── Layout ──────────────────────────────────────────────────────

BS.container = {
  category: 'layout', label: 'Container', icon: '▣',
  defaultProps: { maxWidth: '960px', padding: '20px', background: '#ffffff' },
  template: function (p, children) {
    return '<div class="comp-container" style="max-width:' + p.maxWidth + ';margin:0 auto;padding:' + p.padding + ';background:' + p.background + ';"><div class="component-content">' + (children || '<p style="color:#999;margin:0;">Container content</p>') + '</div></div>';
  },
  propsConfig: [
    { key: 'maxWidth', label: 'Max Width', type: 'text' },
    { key: 'padding', label: 'Padding', type: 'text' },
    { key: 'background', label: 'Background', type: 'color' }
  ]
};

BS.section = {
  category: 'layout', label: 'Section', icon: '▬',
  defaultProps: { padding: '60px 20px', background: '#f8f9fa' },
  template: function (p, children) {
    return '<section class="comp-section py-5 text-center" style="padding:' + p.padding + ';background:' + p.background + ';"><div class="component-content">' + (children || '<h2 style="margin:0 0 12px;font-size:28px;">Section Title</h2><p style="color:#666;margin:0;">Section content goes here.</p>') + '</div></section>';
  },
  propsConfig: [
    { key: 'padding', label: 'Padding', type: 'text' },
    { key: 'background', label: 'Background', type: 'color' }
  ]
};

BS.columns2 = {
  category: 'layout', label: '2 Columns', icon: '▌▐',
  defaultProps: { gap: '20px', padding: '20px' },
  template: function (p, children, cols) {
    return '<div class="comp-columns row g-3" style="padding:' + p.padding + ';background:#fff;"><div data-col="0" class="col-md-6" style="min-height:40px;">' + (cols && cols[0] ? cols[0] : '<div style="padding:12px;background:#f0f0f0;border-radius:4px;text-align:center;"><p style="color:#888;margin:0;">Column 1</p></div>') + '</div><div data-col="1" class="col-md-6" style="min-height:40px;">' + (cols && cols[1] ? cols[1] : '<div style="padding:12px;background:#f0f0f0;border-radius:4px;text-align:center;"><p style="color:#888;margin:0;">Column 2</p></div>') + '</div></div>';
  },
  propsConfig: [
    { key: 'gap', label: 'Gap', type: 'text' },
    { key: 'padding', label: 'Padding', type: 'text' }
  ]
};

BS.columns3 = {
  category: 'layout', label: '3 Columns', icon: '≡',
  defaultProps: { gap: '16px', padding: '20px' },
  template: function (p, children, cols) {
    return '<div class="comp-columns row g-3" style="padding:' + p.padding + ';background:#fff;"><div data-col="0" class="col-md-4" style="min-height:40px;">' + (cols && cols[0] ? cols[0] : '<div style="padding:12px;background:#f0f0f0;border-radius:4px;text-align:center;"><p style="color:#888;margin:0;">Col 1</p></div>') + '</div><div data-col="1" class="col-md-4" style="min-height:40px;">' + (cols && cols[1] ? cols[1] : '<div style="padding:12px;background:#f0f0f0;border-radius:4px;text-align:center;"><p style="color:#888;margin:0;">Col 2</p></div>') + '</div><div data-col="2" class="col-md-4" style="min-height:40px;">' + (cols && cols[2] ? cols[2] : '<div style="padding:12px;background:#f0f0f0;border-radius:4px;text-align:center;"><p style="color:#888;margin:0;">Col 3</p></div>') + '</div></div>';
  },
  propsConfig: [
    { key: 'gap', label: 'Gap', type: 'text' },
    { key: 'padding', label: 'Padding', type: 'text' }
  ]
};

BS.columns4 = {
  category: 'layout', label: '4 Columns', icon: '☰',
  defaultProps: { gap: '12px', padding: '20px' },
  template: function (p, children, cols) {
    return '<div class="comp-columns4 row g-2" style="padding:' + p.padding + ';background:#fff;"><div data-col="0" class="col-md-3" style="min-height:40px;">' + (cols && cols[0] ? cols[0] : '<div style="padding:10px;background:#f5f5f5;border-radius:4px;text-align:center;font-size:13px;color:#888;">Col 1</div>') + '</div><div data-col="1" class="col-md-3" style="min-height:40px;">' + (cols && cols[1] ? cols[1] : '<div style="padding:10px;background:#f5f5f5;border-radius:4px;text-align:center;font-size:13px;color:#888;">Col 2</div>') + '</div><div data-col="2" class="col-md-3" style="min-height:40px;">' + (cols && cols[2] ? cols[2] : '<div style="padding:10px;background:#f5f5f5;border-radius:4px;text-align:center;font-size:13px;color:#888;">Col 3</div>') + '</div><div data-col="3" class="col-md-3" style="min-height:40px;">' + (cols && cols[3] ? cols[3] : '<div style="padding:10px;background:#f5f5f5;border-radius:4px;text-align:center;font-size:13px;color:#888;">Col 4</div>') + '</div></div>';
  },
  propsConfig: [
    { key: 'gap', label: 'Gap', type: 'text' },
    { key: 'padding', label: 'Padding', type: 'text' }
  ]
};

BS.header = {
  category: 'layout', label: 'Header', icon: '⊞',
  defaultProps: { brand: 'Logo', bgColor: '#2c3e50', textColor: '#ffffff' },
  template: function (p, children) {
    return '<header class="comp-header navbar" style="background:' + p.bgColor + ';color:' + p.textColor + ';padding:12px 24px;display:flex;align-items:center;justify-content:space-between;"><strong class="navbar-brand mb-0" style="color:' + p.textColor + ';font-size:18px;">' + p.brand + '</strong><nav class="d-flex gap-3"><a href="#" class="text-decoration-none" style="color:' + p.textColor + ';font-size:14px;">Home</a><a href="#" class="text-decoration-none" style="color:' + p.textColor + ';font-size:14px;">About</a><a href="#" class="text-decoration-none" style="color:' + p.textColor + ';font-size:14px;">Contact</a></nav><div class="component-content">' + (children || '') + '</div></header>';
  },
  propsConfig: [
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'bgColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' }
  ]
};

BS.footer = {
  category: 'layout', label: 'Footer', icon: '⊟',
  defaultProps: { text: '© 2026 All rights reserved.', bgColor: '#2c3e50', textColor: '#ffffff' },
  template: function (p, children) {
    return '<footer class="comp-footer py-4 text-center" style="background:' + p.bgColor + ';color:' + p.textColor + ';font-size:14px;"><div class="component-content">' + (children || p.text) + '</div></footer>';
  },
  propsConfig: [
    { key: 'text', label: 'Text', type: 'text' },
    { key: 'bgColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' }
  ]
};

// ── UI Elements ──────────────────────────────────────────────────

BS.button = {
  category: 'ui', label: 'Button', icon: '▢',
  defaultProps: { text: 'Click Me', variant: '#e94560', size: '14px', fullWidth: false },
  template: function (p) {
    var btnSize = p.size === '16px' ? 'btn-lg' : p.size === '12px' ? 'btn-sm' : '';
    return '<div style="padding:8px;text-align:center;"><button class="comp-button btn text-white ' + btnSize + '" style="background:' + p.variant + ';border:none;' + (p.fullWidth ? 'width:100%;' : '') + 'font-weight:600;">' + p.text + '</button></div>';
  },
  propsConfig: [
    { key: 'text', label: 'Text', type: 'text' },
    { key: 'variant', label: 'Color', type: 'color' },
    { key: 'size', label: 'Size', type: 'select', options: ['12px', '14px', '16px'] },
    { key: 'fullWidth', label: 'Full Width', type: 'checkbox' }
  ]
};

BS.card = {
  category: 'ui', label: 'Card', icon: '◻',
  defaultProps: { title: 'Card Title', text: 'Some quick example text for this card.', btnText: 'Learn More', accentColor: '#e94560' },
  template: function (p) {
    return '<div class="comp-card card m-3 shadow-sm" style="border:1px solid #e0e0e0;"><div class="card-body"><h5 class="card-title" style="font-size:18px;">' + p.title + '</h5><p class="card-text" style="color:#666;font-size:14px;">' + p.text + '</p><a href="#" class="btn text-white" style="background:' + p.accentColor + ';border:none;font-size:13px;font-weight:600;">' + p.btnText + '</a></div></div>';
  },
  propsConfig: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'text', label: 'Text', type: 'textarea' },
    { key: 'btnText', label: 'Button Text', type: 'text' },
    { key: 'accentColor', label: 'Accent Color', type: 'color' }
  ]
};

BS.alert = {
  category: 'ui', label: 'Alert', icon: '⚠',
  defaultProps: { message: 'This is an alert message!', type: '#e94560', dismissible: false },
  template: function (p) {
    return '<div class="comp-alert alert d-flex align-items-center justify-content-between" style="background:' + p.type + '16;border:1px solid ' + p.type + ';border-radius:4px;padding:12px 16px;margin:8px 12px;color:#333;font-size:14px;"><span>' + p.message + '</span>' + (p.dismissible ? '<button type="button" class="btn-close" style="font-size:14px;"></button>' : '') + '</div>';
  },
  propsConfig: [
    { key: 'message', label: 'Message', type: 'text' },
    { key: 'type', label: 'Color', type: 'color' },
    { key: 'dismissible', label: 'Dismissible', type: 'checkbox' }
  ]
};

BS.badge = {
  category: 'ui', label: 'Badge', icon: '◆',
  defaultProps: { text: 'New', color: '#e94560' },
  template: function (p) {
    return '<div style="padding:8px 12px;"><span class="comp-badge badge" style="background:' + p.color + ';font-size:12px;font-weight:600;">' + p.text + '</span></div>';
  },
  propsConfig: [
    { key: 'text', label: 'Text', type: 'text' },
    { key: 'color', label: 'Color', type: 'color' }
  ]
};

BS.divider = {
  category: 'ui', label: 'Divider', icon: '—',
  defaultProps: { color: '#e0e0e0', thickness: '1px', margin: '16px 12px' },
  template: function (p) {
    return '<hr class="comp-divider" style="border:none;border-top:' + p.thickness + ' solid ' + p.color + ';margin:' + p.margin + ';">';
  },
  propsConfig: [
    { key: 'color', label: 'Color', type: 'color' },
    { key: 'thickness', label: 'Thickness', type: 'text' },
    { key: 'margin', label: 'Margin', type: 'text' }
  ]
};

BS.list = {
  category: 'ui', label: 'List', icon: '☰',
  defaultProps: { items: 'Item 1\nItem 2\nItem 3', ordered: false },
  template: function (p) {
    var items = p.items.split('\n').map(function (i) { return i.trim(); }).filter(Boolean);
    var tag = p.ordered ? 'ol' : 'ul';
    var lis = items.map(function (i) { return '<li class="list-group-item" style="padding:8px 12px;font-size:14px;color:#444;">' + i + '</li>'; }).join('\n    ');
    return '<' + tag + ' class="comp-list list-group" style="margin:12px 24px;">\n    ' + lis + '\n  </' + tag + '>';
  },
  propsConfig: [
    { key: 'items', label: 'Items (one per line)', type: 'textarea' },
    { key: 'ordered', label: 'Ordered', type: 'checkbox' }
  ]
};

BS.table = {
  category: 'ui', label: 'Table', icon: '⊞',
  defaultProps: { header1: 'Name', header2: 'Email', header3: 'Role', row1: 'John Doe', row1e: 'john@example.com', row1r: 'Admin', row2: 'Jane Smith', row2e: 'jane@example.com', row2r: 'Editor', row3: 'Bob Johnson', row3e: 'bob@example.com', row3r: 'Viewer' },
  template: function (p) {
    return '<div style="padding:12px;overflow-x:auto;"><table class="comp-table table table-bordered" style="font-size:14px;"><thead class="table-light"><tr><th style="padding:10px 12px;">' + p.header1 + '</th><th style="padding:10px 12px;">' + p.header2 + '</th><th style="padding:10px 12px;">' + p.header3 + '</th></tr></thead><tbody><tr><td style="padding:10px 12px;">' + p.row1 + '</td><td style="padding:10px 12px;">' + p.row1e + '</td><td style="padding:10px 12px;">' + p.row1r + '</td></tr><tr><td style="padding:10px 12px;">' + p.row2 + '</td><td style="padding:10px 12px;">' + p.row2e + '</td><td style="padding:10px 12px;">' + p.row2r + '</td></tr><tr><td style="padding:10px 12px;">' + p.row3 + '</td><td style="padding:10px 12px;">' + p.row3e + '</td><td style="padding:10px 12px;">' + p.row3r + '</td></tr></tbody></table></div>';
  },
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
};

// ── Content Sections ─────────────────────────────────────────────

BS.hero = {
  category: 'content', label: 'Hero', icon: '⬡',
  defaultProps: { heading: 'Build Something Amazing', subtitle: 'Create beautiful pages with our drag-and-drop builder.', ctaText: 'Get Started', bgColor: '#1a1a2e', textColor: '#ffffff', align: 'center' },
  template: function (p) {
    return '<section class="comp-hero py-5 text-center text-white" style="background:' + p.bgColor + ';text-align:' + p.align + ';color:' + p.textColor + ';padding:80px 24px;"><h1 class="display-4 fw-bold" style="margin:0 0 16px;">' + p.heading + '</h1><p class="lead mx-auto" style="max-width:600px;opacity:0.85;margin-bottom:24px;">' + p.subtitle + '</p><button class="btn btn-lg" style="background:' + p.textColor + ';color:' + p.bgColor + ';border:none;font-weight:700;">' + p.ctaText + '</button></section>';
  },
  propsConfig: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: 'ctaText', label: 'Button Text', type: 'text' },
    { key: 'bgColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'align', label: 'Alignment', type: 'select', options: ['left', 'center', 'right'] }
  ]
};

BS.features = {
  category: 'content', label: 'Features', icon: '⊞',
  defaultProps: { heading: 'Features', feature1: 'Fast', desc1: 'Lightning quick performance.', feature2: 'Simple', desc2: 'Easy to use interface.', feature3: 'Powerful', desc3: 'Do more with less effort.' },
  template: function (p) {
    return '<section class="comp-features py-5 text-center bg-light"><h2 class="mb-5" style="font-size:32px;color:#222;">' + p.heading + '</h2><div class="row g-4 mx-auto" style="max-width:900px;"><div class="col-md-4"><div class="card h-100 shadow-sm border-0"><div class="card-body py-4"><div style="font-size:32px;margin-bottom:12px;">⚡</div><h5 class="card-title" style="font-size:18px;color:#333;">' + p.feature1 + '</h5><p class="card-text" style="color:#666;font-size:14px;">' + p.desc1 + '</p></div></div></div><div class="col-md-4"><div class="card h-100 shadow-sm border-0"><div class="card-body py-4"><div style="font-size:32px;margin-bottom:12px;">🎯</div><h5 class="card-title" style="font-size:18px;color:#333;">' + p.feature2 + '</h5><p class="card-text" style="color:#666;font-size:14px;">' + p.desc2 + '</p></div></div></div><div class="col-md-4"><div class="card h-100 shadow-sm border-0"><div class="card-body py-4"><div style="font-size:32px;margin-bottom:12px;">🚀</div><h5 class="card-title" style="font-size:18px;color:#333;">' + p.feature3 + '</h5><p class="card-text" style="color:#666;font-size:14px;">' + p.desc3 + '</p></div></div></div></div></section>';
  },
  propsConfig: [
    { key: 'heading', label: 'Section Heading', type: 'text' },
    { key: 'feature1', label: 'Feature 1 Name', type: 'text' },
    { key: 'desc1', label: 'Feature 1 Desc', type: 'text' },
    { key: 'feature2', label: 'Feature 2 Name', type: 'text' },
    { key: 'desc2', label: 'Feature 2 Desc', type: 'text' },
    { key: 'feature3', label: 'Feature 3 Name', type: 'text' },
    { key: 'desc3', label: 'Feature 3 Desc', type: 'text' }
  ]
};

BS.pricing = {
  category: 'content', label: 'Pricing', icon: '$',
  defaultProps: { plan: 'Pro', price: '$29', period: '/mo', feature1: '10 projects', feature2: 'Unlimited pages', feature3: 'Priority support', ctaText: 'Choose Plan', accentColor: '#e94560' },
  template: function (p) {
    return '<section class="py-5 text-center bg-white"><div class="card mx-auto shadow" style="max-width:340px;border:2px solid ' + p.accentColor + ';border-radius:12px;"><div class="card-body p-4"><h3 class="card-title" style="font-size:20px;color:#333;">' + p.plan + '</h3><div class="display-4 fw-bold" style="color:#222;">' + p.price + '<span class="fs-6 fw-normal text-muted">' + p.period + '</span></div><ul class="list-unstyled mt-4 mb-4 text-start"><li class="py-2" style="font-size:14px;color:#555;">✓ ' + p.feature1 + '</li><li class="py-2" style="font-size:14px;color:#555;">✓ ' + p.feature2 + '</li><li class="py-2" style="font-size:14px;color:#555;">✓ ' + p.feature3 + '</li></ul><button class="btn w-100 text-white" style="background:' + p.accentColor + ';border:none;font-weight:700;">' + p.ctaText + '</button></div></div></section>';
  },
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
};

BS.testimonial = {
  category: 'content', label: 'Testimonial', icon: '"',
  defaultProps: { quote: 'This is the best product we have ever used. Highly recommended!', author: 'Jane Doe', role: 'CEO, Company Inc.' },
  template: function (p) {
    return '<div class="p-4 text-center bg-light rounded-3 m-3"><figure class="mb-0"><blockquote class="blockquote"><p style="font-size:16px;font-style:italic;color:#555;line-height:1.6;">"' + p.quote + '"</p></blockquote><figcaption class="blockquote-footer mb-0" style="font-size:14px;color:#333;">' + p.author + '<br><span style="font-size:13px;color:#888;">' + p.role + '</span></figcaption></figure></div>';
  },
  propsConfig: [
    { key: 'quote', label: 'Quote', type: 'textarea' },
    { key: 'author', label: 'Author', type: 'text' },
    { key: 'role', label: 'Role', type: 'text' }
  ]
};

BS.contact = {
  category: 'content', label: 'Contact Form', icon: '✉',
  defaultProps: { email: 'hello@example.com', btnText: 'Send Message', accentColor: '#e94560' },
  template: function (p) {
    return '<section class="py-5 bg-white"><form class="mx-auto" style="max-width:500px;"><div class="mb-3"><label class="form-label" style="font-size:13px;font-weight:600;color:#555;">Name</label><input type="text" class="form-control" placeholder="Your name" style="font-size:14px;"></div><div class="mb-3"><label class="form-label" style="font-size:13px;font-weight:600;color:#555;">Email</label><input type="email" class="form-control" placeholder="' + p.email + '" style="font-size:14px;"></div><div class="mb-3"><label class="form-label" style="font-size:13px;font-weight:600;color:#555;">Message</label><textarea class="form-control" rows="4" placeholder="Your message" style="font-size:14px;"></textarea></div><button type="submit" class="btn text-white" style="background:' + p.accentColor + ';border:none;font-weight:600;">' + p.btnText + '</button></form></section>';
  },
  propsConfig: [
    { key: 'email', label: 'Placeholder Email', type: 'text' },
    { key: 'btnText', label: 'Button Text', type: 'text' },
    { key: 'accentColor', label: 'Accent Color', type: 'color' }
  ]
};

BS.form = {
  category: 'content', label: 'Form', icon: '📋',
  defaultProps: { heading: 'Get in Touch', nameLabel: 'Name', emailLabel: 'Email', messageLabel: 'Message', btnText: 'Submit', accentColor: '#e94560' },
  template: function (p) {
    return '<section class="py-5 bg-white"><form class="mx-auto p-4 bg-light rounded-3 shadow-sm" style="max-width:480px;"><h3 class="mb-4 text-center" style="font-size:22px;color:#222;">' + p.heading + '</h3><div class="mb-3"><label class="form-label" style="font-size:13px;font-weight:600;color:#555;">' + p.nameLabel + '</label><input type="text" class="form-control" placeholder="' + p.nameLabel + '" style="font-size:14px;"></div><div class="mb-3"><label class="form-label" style="font-size:13px;font-weight:600;color:#555;">' + p.emailLabel + '</label><input type="email" class="form-control" placeholder="' + p.emailLabel + '" style="font-size:14px;"></div><div class="mb-3"><label class="form-label" style="font-size:13px;font-weight:600;color:#555;">' + p.messageLabel + '</label><textarea class="form-control" rows="4" placeholder="' + p.messageLabel + '" style="font-size:14px;"></textarea></div><button type="submit" class="btn w-100 text-white" style="background:' + p.accentColor + ';border:none;font-weight:600;">' + p.btnText + '</button></form></section>';
  },
  propsConfig: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'nameLabel', label: 'Name Label', type: 'text' },
    { key: 'emailLabel', label: 'Email Label', type: 'text' },
    { key: 'messageLabel', label: 'Message Label', type: 'text' },
    { key: 'btnText', label: 'Button Text', type: 'text' },
    { key: 'accentColor', label: 'Accent Color', type: 'color' }
  ]
};

BS.signature = {
  category: 'content', label: 'Signature', icon: '✍',
  defaultProps: { name: 'Sarah Johnson', title: 'CEO & Founder', text: 'Building the future, one step at a time.', photo: '👩‍💼' },
  template: function (p) {
    return '<div class="d-flex align-items-center gap-3 p-4 bg-light rounded-3 m-3"><div class="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle" style="width:64px;height:64px;background:#e94560;color:#fff;font-size:32px;">' + p.photo + '</div><div class="flex-grow-1"><strong class="d-block" style="font-size:16px;color:#222;">' + p.name + '</strong><span class="d-block" style="font-size:13px;color:#e94560;font-weight:600;">' + p.title + '</span><p class="mb-0 mt-1" style="font-size:13px;color:#666;line-height:1.4;">' + p.text + '</p></div></div>';
  },
  propsConfig: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'text', label: 'Description', type: 'text' },
    { key: 'photo', label: 'Photo Emoji', type: 'text' }
  ]
};

BS.product = {
  category: 'content', label: 'Product', icon: '🏷',
  defaultProps: { name: 'Premium Widget', price: '$49.99', oldPrice: '$79.99', desc: 'High-quality widget with premium features and lifetime warranty.', badge: 'Sale', btnText: 'Add to Cart', accentColor: '#e94560' },
  template: function (p) {
    return '<div class="p-3 m-3"><div class="card shadow-sm mx-auto" style="max-width:320px;border:1px solid #eee;overflow:hidden;"><div class="card-body p-0"><div class="position-relative d-flex align-items-center justify-content-center" style="height:160px;background:linear-gradient(135deg,' + p.accentColor + '22,#f8f9fa);"><span style="font-size:48px;">📦</span><span class="position-absolute badge" style="top:12px;left:12px;background:' + p.accentColor + ';font-size:11px;">' + p.badge + '</span><span class="position-absolute" style="top:12px;right:12px;background:#fff;color:#333;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:700;">★ 4.8</span></div><div class="p-3"><h5 class="card-title" style="font-size:17px;color:#222;">' + p.name + '</h5><div class="mb-2"><span class="fw-bold" style="font-size:22px;color:' + p.accentColor + ';">' + p.price + '</span><span class="text-muted text-decoration-line-through ms-2" style="font-size:14px;">' + p.oldPrice + '</span></div><p class="card-text" style="font-size:13px;color:#666;line-height:1.5;">' + p.desc + '</p><button class="btn w-100 text-white" style="background:' + p.accentColor + ';border:none;font-weight:600;">' + p.btnText + '</button></div></div></div></div>';
  },
  propsConfig: [
    { key: 'name', label: 'Product Name', type: 'text' },
    { key: 'price', label: 'Price', type: 'text' },
    { key: 'oldPrice', label: 'Old Price', type: 'text' },
    { key: 'desc', label: 'Description', type: 'textarea' },
    { key: 'badge', label: 'Badge Text', type: 'text' },
    { key: 'btnText', label: 'Button Text', type: 'text' },
    { key: 'accentColor', label: 'Accent Color', type: 'color' }
  ]
};

// ── Typography ───────────────────────────────────────────────────

BS.heading = {
  category: 'typography', label: 'Heading', icon: 'H',
  defaultProps: { text: 'Heading Text', level: 'h2', align: 'left', color: '#222' },
  template: function (p) {
    var sizes = { h1: '36px', h2: '28px', h3: '22px', h4: '18px', h5: '16px', h6: '14px' };
    return '<' + p.level + ' class="comp-heading" style="margin:12px 16px;font-size:' + (sizes[p.level] || '28px') + ';text-align:' + p.align + ';color:' + p.color + ';font-weight:700;line-height:1.3;">' + p.text + '</' + p.level + '>';
  },
  propsConfig: [
    { key: 'text', label: 'Text', type: 'text' },
    { key: 'level', label: 'Level', type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    { key: 'align', label: 'Alignment', type: 'select', options: ['left', 'center', 'right'] },
    { key: 'color', label: 'Color', type: 'color' }
  ]
};

BS.paragraph = {
  category: 'typography', label: 'Paragraph', icon: 'P',
  defaultProps: { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', align: 'left', color: '#444', size: '15px' },
  template: function (p) {
    return '<p class="comp-paragraph" style="margin:8px 16px;font-size:' + p.size + ';text-align:' + p.align + ';color:' + p.color + ';line-height:1.6;">' + p.text + '</p>';
  },
  propsConfig: [
    { key: 'text', label: 'Text', type: 'textarea' },
    { key: 'align', label: 'Alignment', type: 'select', options: ['left', 'center', 'right', 'justify'] },
    { key: 'color', label: 'Color', type: 'color' },
    { key: 'size', label: 'Size', type: 'select', options: ['13px', '14px', '15px', '16px', '18px'] }
  ]
};

BS.blockquote = {
  category: 'typography', label: 'Blockquote', icon: '❝',
  defaultProps: { text: 'The only way to do great work is to love what you do.', cite: 'Steve Jobs', borderColor: '#e94560' },
  template: function (p) {
    return '<figure class="mx-4 my-3 p-3 bg-light rounded-2" style="border-left:4px solid ' + p.borderColor + ';"><blockquote class="blockquote mb-2"><p style="font-size:15px;color:#555;line-height:1.6;">&ldquo;' + p.text + '&rdquo;</p></blockquote><figcaption class="blockquote-footer mb-0" style="font-size:13px;color:#888;">' + p.cite + '</figcaption></figure>';
  },
  propsConfig: [
    { key: 'text', label: 'Quote', type: 'textarea' },
    { key: 'cite', label: 'Citation', type: 'text' },
    { key: 'borderColor', label: 'Border Color', type: 'color' }
  ]
};

BS.code = {
  category: 'typography', label: 'Code Block', icon: '<>',
  defaultProps: { code: 'const greeting = "Hello World";\nconsole.log(greeting);', language: 'javascript' },
  template: function (p) {
    var escaped = p.code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '<pre class="comp-code mx-3 p-3 bg-dark text-light rounded-3" style="font-family:\'SF Mono\',\'Fira Code\',monospace;font-size:13px;line-height:1.5;overflow-x:auto;"><code>' + escaped + '</code></pre>';
  },
  propsConfig: [
    { key: 'code', label: 'Code', type: 'textarea' },
    { key: 'language', label: 'Language', type: 'text' }
  ]
};

// ── Navigation ───────────────────────────────────────────────────

BS.navbar = {
  category: 'navigation', label: 'Navbar', icon: '≡',
  defaultProps: { brand: 'BrandName', link1: 'Home', link2: 'About', link3: 'Services', link4: 'Contact', bgColor: '#ffffff', textColor: '#333' },
  template: function (p) {
    return '<nav class="comp-navbar navbar navbar-expand-lg" style="background:' + p.bgColor + ';color:' + p.textColor + ';padding:0 24px;border-bottom:1px solid #eee;"><div class="container-fluid px-0"><a class="navbar-brand fw-bold mb-0" style="color:' + p.textColor + ';font-size:20px;">' + p.brand + '</a><div class="d-flex gap-3"><a class="nav-link" style="color:' + p.textColor + ';font-size:14px;cursor:pointer;">' + p.link1 + '</a><a class="nav-link" style="color:' + p.textColor + ';font-size:14px;cursor:pointer;">' + p.link2 + '</a><a class="nav-link" style="color:' + p.textColor + ';font-size:14px;cursor:pointer;">' + p.link3 + '</a><a class="nav-link" style="color:' + p.textColor + ';font-size:14px;cursor:pointer;">' + p.link4 + '</a></div></div></nav>';
  },
  propsConfig: [
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'link1', label: 'Link 1', type: 'text' },
    { key: 'link2', label: 'Link 2', type: 'text' },
    { key: 'link3', label: 'Link 3', type: 'text' },
    { key: 'link4', label: 'Link 4', type: 'text' },
    { key: 'bgColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' }
  ]
};

// ── Apply ────────────────────────────────────────────────────────

if (typeof REGISTRY !== 'undefined') {
  for (var key in BS) {
    if (BS.hasOwnProperty(key)) {
      REGISTRY[key] = BS[key];
    }
  }
  if (typeof renderPalette === 'function') renderPalette();
  if (typeof renderCanvas === 'function') renderCanvas();
  console.log('VB Bootstrap Integration applied (' + Object.keys(BS).length + ' components)');
}

})();
