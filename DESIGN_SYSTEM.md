# Universal Design System

This document outlines the universal design system implemented across the Petrol Pump Management System for consistent typography, colors, spacing, and components.

## 🎨 Color Palette

### Primary Colors (Professional Blue)
```css
--color-primary-500: #3b82f6  /* Main Primary Color */
--color-primary-600: #2563eb  /* Hover/Active States */
--color-primary-700: #1d4ed8  /* Dark Variant */
```

**Usage:**
- Primary buttons
- Active navigation items
- Links and accents
- Headers and important elements

### Neutral Colors (Grays)
```css
--color-neutral-100: #f1f5f9  /* Light backgrounds */
--color-neutral-500: #64748b  /* Body text */
--color-neutral-700: #334155  /* Dark text */
--color-neutral-900: #0f172a  /* Headings */
```

**Usage:**
- Text content
- Borders
- Backgrounds
- Disabled states

### Status Colors
- **Success**: `--color-success-600: #16a34a` (Green)
- **Warning**: `--color-warning-600: #d97706` (Orange)
- **Danger**: `--color-danger-600: #dc2626` (Red)
- **Info**: `--color-info-600: #0284c7` (Sky Blue)

## 📝 Typography

### Font Families
```css
Primary: 'Poppins', sans-serif
Fallback: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI'
```

### Universal Font Scale
| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| h1 | 2.5rem (40px) | 700 | 1.2 | Page titles |
| h2 | 2rem (32px) | 600 | 1.3 | Section headers |
| h3 | 1.75rem (28px) | 600 | 1.3 | Subsection headers |
| h4 | 1.5rem (24px) | 500 | 1.4 | Card headers |
| h5 | 1.25rem (20px) | 500 | 1.4 | Minor headers |
| h6 | 1.125rem (18px) | 500 | 1.5 | Small headers |
| p | 1rem (16px) | 400 | 1.6 | Body text |

### Text Utilities
```css
.text-xs     /* 12px - Labels, captions */
.text-sm     /* 14px - Small text */
.text-base   /* 16px - Default body text */
.text-lg     /* 18px - Large body text */
.text-xl     /* 20px - Emphasized text */
.text-2xl    /* 24px - Small headings */
.text-3xl    /* 30px - Medium headings */
.text-4xl    /* 36px - Large headings */
.text-5xl    /* 48px - Display headings */
```

## 📦 Components

### 1. Page Layout
```html
<div class="page-container">
  <header class="page-header">
    <h1 class="page-title">Page Title</h1>
    <p class="page-subtitle">Optional subtitle</p>
  </header>
  
  <main class="content-section">
    <!-- Content here -->
  </main>
</div>
```

### 2. Cards
```html
<div class="universal-card">
  <div class="card-header">Card Title</div>
  <div class="card-content">
    Card content goes here
  </div>
</div>
```

**Variants:**
- `.stat-card` - For statistics/metrics
- `.premium-card` - Enhanced styling
- `.glass-card` - Glassmorphism effect

### 3. Buttons
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary">Secondary Action</button>
<button class="btn btn-success">Save</button>
<button class="btn btn-danger">Delete</button>
```

**Button Sizes:** All buttons have consistent padding (0.75rem × 1.5rem)

### 4. Forms
```html
<div class="form-group">
  <label class="form-label">Input Label</label>
  <input type="text" class="form-input" placeholder="Enter value">
</div>
```

**Form Elements:**
- `.form-input` - Text inputs
- `.form-select` - Dropdown selects
- `.form-textarea` - Text areas
- `.form-label` - Labels

### 5. Tables
```html
<table class="universal-table">
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

**Features:**
- Primary blue header
- Hover effects on rows
- Consistent padding (1rem)
- Responsive design

### 6. Alerts
```html
<div class="alert alert-success">Success message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-danger">Error message</div>
<div class="alert alert-info">Info message</div>
```

### 7. Badges
```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Inactive</span>
```

## 📐 Spacing System

### Universal Padding/Margin Scale
| Class | Size | Pixels | Usage |
|-------|------|--------|-------|
| `spacing-xs` | 0.5rem | 8px | Tight spacing |
| `spacing-sm` | 1rem | 16px | Small spacing |
| `spacing-md` | 1.5rem | 24px | Medium spacing |
| `spacing-lg` | 2rem | 32px | Large spacing |
| `spacing-xl` | 3rem | 48px | Extra large spacing |

### Component Padding Standards
- **Page Container**: 2rem (32px)
- **Cards**: 1.5rem (24px)
- **Forms**: 1.5rem (24px)
- **Modals**: 1.5rem (24px)
- **Buttons**: 0.75rem × 1.5rem (12px × 24px)

## 🔲 Grid System

### Responsive Grids
```html
<div class="grid-1"><!-- 1 column --></div>
<div class="grid-2"><!-- 2 columns --></div>
<div class="grid-3"><!-- 3 columns --></div>
<div class="grid-4"><!-- 4 columns --></div>
```

**Breakpoints:**
- Mobile (<640px): All grids collapse to 1 column
- Tablet (640-1024px): 3-4 col grids become 2 columns
- Desktop (>1024px): Full grid columns

## 🎭 Design Principles

### 1. Consistency
- Same font family everywhere (Poppins)
- Same color scheme across all pages
- Uniform spacing and padding
- Consistent component sizing

### 2. Hierarchy
- Clear visual hierarchy with font sizes
- Primary blue for importance
- Gray scale for content
- Status colors for states

### 3. Symmetry
- Balanced padding on all sides
- Centered layouts
- Even spacing between elements
- Aligned content

### 4. Accessibility
- Minimum font size: 14px
- High contrast colors
- Focus states on all interactive elements
- ARIA-compliant components

### 5. Responsiveness
- Mobile-first approach
- Fluid typography (rem units)
- Responsive grids
- Adaptive spacing

## 🖥️ Page Templates

### Standard Page Layout
```html
<div class="page-container">
  <!-- Page Header -->
  <div class="page-header">
    <h1 class="page-title">Page Title</h1>
    <p class="page-subtitle">Description or breadcrumb</p>
  </div>
  
  <!-- Content Section -->
  <div class="content-section">
    <div class="section-header">Section Title</div>
    <div class="section-body">
      <!-- Content -->
    </div>
  </div>
</div>
```

### Dashboard Layout
```html
<div class="page-container">
  <div class="page-header">
    <h1 class="page-title">Dashboard</h1>
  </div>
  
  <!-- Stats Grid -->
  <div class="grid-4">
    <div class="stat-card">
      <div class="stat-value">1,234</div>
      <div class="stat-label">Total Sales</div>
    </div>
    <!-- More stat cards -->
  </div>
  
  <!-- Other content -->
</div>
```

### Form Page Layout
```html
<div class="page-container">
  <div class="page-header">
    <h1 class="page-title">Form Title</h1>
  </div>
  
  <div class="universal-card">
    <div class="card-header">Section Title</div>
    <form class="form-padding">
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Field Label</label>
          <input type="text" class="form-input">
        </div>
        <!-- More fields -->
      </div>
      
      <div class="flex justify-end gap-sm">
        <button type="button" class="btn btn-secondary">Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  </div>
</div>
```

## 🚀 Usage Examples

### Button Group
```html
<div class="flex gap-sm">
  <button class="btn btn-primary">Save</button>
  <button class="btn btn-secondary">Cancel</button>
  <button class="btn btn-danger">Delete</button>
</div>
```

### Status Indicator
```html
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Inactive</span>
```

### Form with Validation
```html
<div class="form-group">
  <label class="form-label">Email Address</label>
  <input type="email" class="form-input" placeholder="name@example.com">
  <div class="alert alert-danger">Please enter a valid email</div>
</div>
```

## 🎯 Benefits

1. **Faster Development**: Pre-built components
2. **Consistency**: Same look everywhere
3. **Maintainability**: Single source of truth
4. **Scalability**: Easy to update globally
5. **Professionalism**: Clean, modern design

## 📚 Files

- **[`frontend/src/index.css`](frontend/src/index.css)** - Base styles with Tailwind
- **[`frontend/src/design-system.css`](frontend/src/design-system.css)** - Universal component styles
- **[`frontend/tailwind.config.js`](frontend/tailwind.config.js)** - Tailwind configuration
- **[`frontend/index.html`](frontend/index.html)** - Google Fonts import

## 🔄 Applying the Design System

All these styles are automatically applied throughout the application. The live dev server will refresh when you save changes to any CSS file.

**Your application now has:**
✅ Universal Poppins font family
✅ Consistent 16px base font size
✅ Symmetric spacing and padding
✅ Professional blue color scheme
✅ Unified component designs
✅ Responsive layouts
✅ Dark mode support
