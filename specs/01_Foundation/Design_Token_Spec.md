# 设计令牌规范 (Design Token Spec)

> 版本：V1.0  
> 更新日期：2026-01-17  
> 所属模块：01_Foundation

---

## 1. 概述

### 1.1 目的
设计令牌（Design Tokens）是设计系统的基础构建块，定义了颜色、字体、间距、圆角、阴影等视觉属性的标准化值。通过统一的设计令牌：
- 确保产品视觉一致性
- 便于主题切换和品牌定制
- 提高设计与开发协作效率
- 支持多平台适配

### 1.2 令牌层级

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              设计令牌层级                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  语义令牌 (Semantic Tokens)                                          │   │
│  │  如：--color-primary, --color-danger, --text-heading               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    ▲                                        │
│                                    │ 引用                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  基础令牌 (Base Tokens)                                              │   │
│  │  如：--blue-500, --gray-100, --font-size-16                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    ▲                                        │
│                                    │ 引用                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  原始值 (Primitive Values)                                           │   │
│  │  如：#1890ff, 16px, 400                                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 命名规范

```
--{category}-{property}-{variant}-{state}

示例：
--color-primary-500           颜色-主色-500色阶
--color-text-secondary        颜色-文本-次要
--spacing-md                  间距-中等
--font-size-heading-1         字号-标题-1级
--border-radius-lg            圆角-大
--shadow-card                 阴影-卡片
```

---

## 2. 颜色系统

### 2.1 品牌色

```css
/* 主色 - 蓝色系 */
--color-primary-50:  #e6f4ff;
--color-primary-100: #bae0ff;
--color-primary-200: #91caff;
--color-primary-300: #69b1ff;
--color-primary-400: #4096ff;
--color-primary-500: #1677ff;  /* 主色 */
--color-primary-600: #0958d9;
--color-primary-700: #003eb3;
--color-primary-800: #002c8c;
--color-primary-900: #001d66;

/* 主色语义别名 */
--color-primary:       var(--color-primary-500);
--color-primary-hover: var(--color-primary-400);
--color-primary-active: var(--color-primary-600);
--color-primary-bg:    var(--color-primary-50);
--color-primary-border: var(--color-primary-200);
```

### 2.2 功能色

```css
/* 成功色 - 绿色系 */
--color-success-50:  #f6ffed;
--color-success-100: #d9f7be;
--color-success-500: #52c41a;  /* 主值 */
--color-success-600: #389e0d;
--color-success:     var(--color-success-500);

/* 警告色 - 橙色系 */
--color-warning-50:  #fffbe6;
--color-warning-100: #fff1b8;
--color-warning-500: #faad14;  /* 主值 */
--color-warning-600: #d48806;
--color-warning:     var(--color-warning-500);

/* 错误色 - 红色系 */
--color-danger-50:  #fff2f0;
--color-danger-100: #ffccc7;
--color-danger-500: #ff4d4f;   /* 主值 */
--color-danger-600: #cf1322;
--color-danger:     var(--color-danger-500);

/* 信息色 - 蓝色系 */
--color-info-50:  #e6f4ff;
--color-info-100: #bae0ff;
--color-info-500: #1677ff;     /* 主值 */
--color-info-600: #0958d9;
--color-info:     var(--color-info-500);
```

### 2.3 中性色

```css
/* 灰色系 */
--color-gray-50:  #fafafa;
--color-gray-100: #f5f5f5;
--color-gray-200: #e8e8e8;
--color-gray-300: #d9d9d9;
--color-gray-400: #bfbfbf;
--color-gray-500: #8c8c8c;
--color-gray-600: #595959;
--color-gray-700: #434343;
--color-gray-800: #262626;
--color-gray-900: #141414;

/* 纯色 */
--color-white: #ffffff;
--color-black: #000000;
```

### 2.4 语义颜色

```css
/* 文本颜色 */
--color-text-primary:   var(--color-gray-900);   /* 主要文本 */
--color-text-secondary: var(--color-gray-600);   /* 次要文本 */
--color-text-tertiary:  var(--color-gray-500);   /* 辅助文本 */
--color-text-disabled:  var(--color-gray-400);   /* 禁用文本 */
--color-text-inverse:   var(--color-white);      /* 反色文本 */
--color-text-link:      var(--color-primary);    /* 链接文本 */

/* 背景颜色 */
--color-bg-page:        var(--color-gray-100);   /* 页面背景 */
--color-bg-container:   var(--color-white);      /* 容器背景 */
--color-bg-elevated:    var(--color-white);      /* 浮层背景 */
--color-bg-spotlight:   var(--color-gray-50);    /* 高亮背景 */
--color-bg-mask:        rgba(0, 0, 0, 0.45);     /* 遮罩背景 */

/* 边框颜色 */
--color-border-primary:   var(--color-gray-300); /* 主要边框 */
--color-border-secondary: var(--color-gray-200); /* 次要边框 */
--color-border-split:     var(--color-gray-100); /* 分割线 */

/* 填充颜色 */
--color-fill-primary:   var(--color-gray-100);   /* 主要填充 */
--color-fill-secondary: var(--color-gray-50);    /* 次要填充 */
--color-fill-tertiary:  var(--color-gray-200);   /* 第三填充 */
```

### 2.5 数据可视化色板

```css
/* 图表色板 - 8色 */
--color-chart-1: #1677ff;  /* 蓝 */
--color-chart-2: #52c41a;  /* 绿 */
--color-chart-3: #faad14;  /* 橙 */
--color-chart-4: #ff4d4f;  /* 红 */
--color-chart-5: #722ed1;  /* 紫 */
--color-chart-6: #13c2c2;  /* 青 */
--color-chart-7: #eb2f96;  /* 粉 */
--color-chart-8: #fa8c16;  /* 橘 */

/* 渐变色 */
--color-gradient-primary: linear-gradient(135deg, #1677ff 0%, #69b1ff 100%);
--color-gradient-success: linear-gradient(135deg, #52c41a 0%, #95de64 100%);
```

---

## 3. 字体系统

### 3.1 字体族

```css
/* 字体族 */
--font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                    'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
                    'Apple Color Emoji', 'Segoe UI Emoji';

--font-family-code: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, 
                    Courier, monospace;

--font-family-heading: var(--font-family-base);
```

### 3.2 字号

```css
/* 基础字号 */
--font-size-xs:   12px;   /* 辅助文字 */
--font-size-sm:   13px;   /* 次要文字 */
--font-size-base: 14px;   /* 正文（基准） */
--font-size-md:   15px;   /* 正文加强 */
--font-size-lg:   16px;   /* 小标题 */
--font-size-xl:   18px;   /* 标题 */
--font-size-2xl:  20px;   /* 大标题 */
--font-size-3xl:  24px;   /* 页面标题 */
--font-size-4xl:  30px;   /* 特大标题 */
--font-size-5xl:  38px;   /* 超大标题 */

/* 标题字号 */
--font-size-h1: var(--font-size-4xl);  /* 30px */
--font-size-h2: var(--font-size-3xl);  /* 24px */
--font-size-h3: var(--font-size-2xl);  /* 20px */
--font-size-h4: var(--font-size-xl);   /* 18px */
--font-size-h5: var(--font-size-lg);   /* 16px */
--font-size-h6: var(--font-size-base); /* 14px */
```

### 3.3 字重

```css
/* 字重 */
--font-weight-light:    300;
--font-weight-regular:  400;  /* 正文 */
--font-weight-medium:   500;  /* 强调 */
--font-weight-semibold: 600;  /* 标题 */
--font-weight-bold:     700;  /* 重要标题 */
```

### 3.4 行高

```css
/* 行高 */
--line-height-tight:  1.25;  /* 紧凑 - 标题 */
--line-height-snug:   1.375; /* 较紧 */
--line-height-normal: 1.5;   /* 正常 - 正文 */
--line-height-relaxed: 1.625;/* 宽松 */
--line-height-loose:  2;     /* 很松 */

/* 固定行高 */
--line-height-xs: 20px;
--line-height-sm: 22px;
--line-height-base: 24px;
--line-height-lg: 28px;
--line-height-xl: 32px;
```

### 3.5 字间距

```css
/* 字间距 */
--letter-spacing-tight:  -0.025em;
--letter-spacing-normal: 0;
--letter-spacing-wide:   0.025em;
--letter-spacing-wider:  0.05em;
```

---

## 4. 间距系统

### 4.1 基础间距

```css
/* 基于 4px 栅格 */
--spacing-0:   0;
--spacing-1:   4px;    /* 0.25rem */
--spacing-2:   8px;    /* 0.5rem */
--spacing-3:   12px;   /* 0.75rem */
--spacing-4:   16px;   /* 1rem - 基准 */
--spacing-5:   20px;   /* 1.25rem */
--spacing-6:   24px;   /* 1.5rem */
--spacing-8:   32px;   /* 2rem */
--spacing-10:  40px;   /* 2.5rem */
--spacing-12:  48px;   /* 3rem */
--spacing-16:  64px;   /* 4rem */
--spacing-20:  80px;   /* 5rem */
--spacing-24:  96px;   /* 6rem */
```

### 4.2 语义间距

```css
/* 组件内间距 */
--spacing-component-xs: var(--spacing-1);   /* 4px */
--spacing-component-sm: var(--spacing-2);   /* 8px */
--spacing-component-md: var(--spacing-3);   /* 12px */
--spacing-component-lg: var(--spacing-4);   /* 16px */
--spacing-component-xl: var(--spacing-6);   /* 24px */

/* 内容区间距 */
--spacing-content-xs: var(--spacing-4);     /* 16px */
--spacing-content-sm: var(--spacing-5);     /* 20px */
--spacing-content-md: var(--spacing-6);     /* 24px */
--spacing-content-lg: var(--spacing-8);     /* 32px */
--spacing-content-xl: var(--spacing-12);    /* 48px */

/* 布局间距 */
--spacing-layout-xs: var(--spacing-6);      /* 24px */
--spacing-layout-sm: var(--spacing-8);      /* 32px */
--spacing-layout-md: var(--spacing-10);     /* 40px */
--spacing-layout-lg: var(--spacing-16);     /* 64px */
--spacing-layout-xl: var(--spacing-24);     /* 96px */
```

---

## 5. 尺寸系统

### 5.1 组件尺寸

```css
/* 按钮/输入框等组件高度 */
--size-xs: 24px;
--size-sm: 28px;
--size-md: 32px;   /* 默认 */
--size-lg: 40px;
--size-xl: 48px;

/* 图标尺寸 */
--icon-size-xs: 12px;
--icon-size-sm: 14px;
--icon-size-md: 16px;  /* 默认 */
--icon-size-lg: 20px;
--icon-size-xl: 24px;
--icon-size-2xl: 32px;

/* 头像尺寸 */
--avatar-size-xs: 24px;
--avatar-size-sm: 32px;
--avatar-size-md: 40px;  /* 默认 */
--avatar-size-lg: 48px;
--avatar-size-xl: 64px;
```

### 5.2 布局尺寸

```css
/* 侧边栏宽度 */
--sidebar-width-collapsed: 64px;
--sidebar-width-expanded: 220px;

/* 头部高度 */
--header-height: 56px;

/* 内容区最大宽度 */
--content-max-width-sm: 640px;
--content-max-width-md: 768px;
--content-max-width-lg: 1024px;
--content-max-width-xl: 1280px;
--content-max-width-2xl: 1536px;

/* 弹窗宽度 */
--modal-width-xs: 320px;
--modal-width-sm: 480px;
--modal-width-md: 640px;
--modal-width-lg: 800px;
--modal-width-xl: 1000px;
```

---

## 6. 圆角系统

```css
/* 圆角 */
--radius-none: 0;
--radius-xs:   2px;
--radius-sm:   4px;
--radius-md:   6px;   /* 默认 */
--radius-lg:   8px;
--radius-xl:   12px;
--radius-2xl:  16px;
--radius-3xl:  24px;
--radius-full: 9999px; /* 全圆 */

/* 语义圆角 */
--radius-button: var(--radius-md);
--radius-input:  var(--radius-md);
--radius-card:   var(--radius-lg);
--radius-modal:  var(--radius-xl);
--radius-tag:    var(--radius-sm);
--radius-avatar: var(--radius-full);
```

---

## 7. 阴影系统

```css
/* 阴影 */
--shadow-none: none;

/* 阴影 - 按高度层级 */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 
             0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
             0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
             0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
             0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* 语义阴影 */
--shadow-card:     var(--shadow-sm);
--shadow-dropdown: var(--shadow-lg);
--shadow-modal:    var(--shadow-xl);
--shadow-toast:    var(--shadow-lg);

/* 聚焦阴影 */
--shadow-focus: 0 0 0 2px var(--color-primary-200);
--shadow-focus-danger: 0 0 0 2px var(--color-danger-100);
```

---

## 8. 动效系统

### 8.1 时长

```css
/* 动画时长 */
--duration-instant:  0ms;
--duration-fastest:  50ms;
--duration-faster:   100ms;
--duration-fast:     150ms;
--duration-normal:   200ms;  /* 默认 */
--duration-slow:     300ms;
--duration-slower:   400ms;
--duration-slowest:  500ms;

/* 语义时长 */
--duration-fade:      var(--duration-normal);
--duration-expand:    var(--duration-slow);
--duration-collapse:  var(--duration-fast);
--duration-slide:     var(--duration-slow);
```

### 8.2 缓动函数

```css
/* 缓动曲线 */
--ease-linear:      linear;
--ease-in:          cubic-bezier(0.4, 0, 1, 1);
--ease-out:         cubic-bezier(0, 0, 0.2, 1);
--ease-in-out:      cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce:      cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* 语义缓动 */
--ease-default:     var(--ease-in-out);
--ease-enter:       var(--ease-out);
--ease-exit:        var(--ease-in);
```

### 8.3 预设动画

```css
/* 过渡预设 */
--transition-colors: color, background-color, border-color, fill, stroke;
--transition-opacity: opacity;
--transition-shadow: box-shadow;
--transition-transform: transform;
--transition-all: all;

/* 完整过渡定义 */
--transition-default: all var(--duration-normal) var(--ease-default);
--transition-fast: all var(--duration-fast) var(--ease-default);
--transition-slow: all var(--duration-slow) var(--ease-default);
```

---

## 9. 边框系统

```css
/* 边框宽度 */
--border-width-none: 0;
--border-width-thin: 1px;
--border-width-medium: 2px;
--border-width-thick: 4px;

/* 边框样式 */
--border-style-solid: solid;
--border-style-dashed: dashed;
--border-style-dotted: dotted;

/* 完整边框定义 */
--border-default: var(--border-width-thin) var(--border-style-solid) var(--color-border-primary);
--border-light: var(--border-width-thin) var(--border-style-solid) var(--color-border-secondary);
--border-focus: var(--border-width-medium) var(--border-style-solid) var(--color-primary);
```

---

## 10. 层级系统

```css
/* z-index 层级 */
--z-index-hide:      -1;
--z-index-base:      0;
--z-index-docked:    10;
--z-index-dropdown:  1000;
--z-index-sticky:    1100;
--z-index-fixed:     1200;
--z-index-overlay:   1300;
--z-index-modal:     1400;
--z-index-popover:   1500;
--z-index-toast:     1600;
--z-index-tooltip:   1700;
--z-index-max:       9999;
```

---

## 11. 断点系统

```css
/* 响应式断点 */
--breakpoint-xs: 480px;   /* 手机 */
--breakpoint-sm: 576px;   /* 手机横屏 */
--breakpoint-md: 768px;   /* 平板 */
--breakpoint-lg: 992px;   /* 小桌面 */
--breakpoint-xl: 1200px;  /* 桌面 */
--breakpoint-2xl: 1600px; /* 大桌面 */

/* 媒体查询 */
@custom-media --mobile (max-width: 767px);
@custom-media --tablet (min-width: 768px) and (max-width: 991px);
@custom-media --desktop (min-width: 992px);
@custom-media --large-desktop (min-width: 1200px);
```

---

## 12. 主题配置

### 12.1 亮色主题（默认）

```css
:root, [data-theme="light"] {
  --color-scheme: light;
  
  /* 基础色引用亮色值 */
  --color-bg-page: var(--color-gray-100);
  --color-bg-container: var(--color-white);
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-border-primary: var(--color-gray-300);
}
```

### 12.2 暗色主题

```css
[data-theme="dark"] {
  --color-scheme: dark;
  
  /* 暗色背景 */
  --color-bg-page: #141414;
  --color-bg-container: #1f1f1f;
  --color-bg-elevated: #262626;
  --color-bg-spotlight: #2a2a2a;
  
  /* 暗色文本 */
  --color-text-primary: rgba(255, 255, 255, 0.95);
  --color-text-secondary: rgba(255, 255, 255, 0.65);
  --color-text-tertiary: rgba(255, 255, 255, 0.45);
  --color-text-disabled: rgba(255, 255, 255, 0.25);
  
  /* 暗色边框 */
  --color-border-primary: #434343;
  --color-border-secondary: #303030;
  --color-border-split: #262626;
  
  /* 调整主色亮度 */
  --color-primary: #3c89ff;
  --color-primary-hover: #5c9fff;
}
```

---

## 13. 使用指南

### 13.1 在CSS中使用

```css
.button {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-button);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-default);
}

.button:hover {
  background-color: var(--color-primary-hover);
}

.card {
  background-color: var(--color-bg-container);
  border: var(--border-light);
  border-radius: var(--radius-card);
  padding: var(--spacing-content-md);
  box-shadow: var(--shadow-card);
}
```

### 13.2 在JavaScript/TypeScript中使用

```typescript
// tokens.ts
export const tokens = {
  colors: {
    primary: 'var(--color-primary)',
    success: 'var(--color-success)',
    danger: 'var(--color-danger)',
  },
  spacing: {
    sm: 'var(--spacing-2)',
    md: 'var(--spacing-4)',
    lg: 'var(--spacing-6)',
  },
  // ...
} as const;

// 在styled-components中使用
const Button = styled.button`
  background-color: ${tokens.colors.primary};
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
`;
```

### 13.3 在Tailwind CSS中配置

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          500: 'var(--color-primary-500)',
          // ...
        },
      },
      spacing: {
        'component-sm': 'var(--spacing-component-sm)',
        'component-md': 'var(--spacing-component-md)',
        // ...
      },
    },
  },
};
```

---

## 14. 版本历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-01-17 | 初版 | - |