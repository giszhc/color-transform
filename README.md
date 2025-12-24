# @giszhc/color-transform

轻量的颜色工具库 — 生成颜色、格式互转与渐变，适合用于 UI 设计与配色工具。

## 安装

使用 pnpm：

```bash
pnpm add @giszhc/color-transform
```

> 开发环境：本仓库使用 Vite + TypeScript（推荐使用 pnpm）。

## 快速开始（示例）

```ts
import {
  generateColors,
  generateGradient,
  randomHex,
  complementaryHex,
  hexToHsl,
  analogousPalette,
  hexToRgbString,
  hexToRgbaString,
  rgbToRgbaString,
  rgbaToRgbString,
  rgbStringToHex,
  rgbaStringToHex,
} from '@giszhc/color-transform'

// 生成 5 个 hex 颜色
const colors = generateColors({ count: 5, format: 'hex' })

// 生成从红到蓝的 5 步渐变
const grad = generateGradient('#ff0000', '#0000ff', 5)

// 格式互转示例
hexToRgbString('#336699') // 'rgb(51, 102, 153)'
hexToRgbaString('#336699', 0.25) // 'rgba(51, 102, 153, 0.25)'
rgbStringToHex('rgb(255,0,128)') // '#ff0080'
rgbaStringToHex('rgba(255,0,128,0.5)') // '#ff0080'
```

### 颜色生成器（简介）

`generateColors` 提供快速生成一组视觉上协调的颜色，默认映射到 HSL 空间以保证颜色饱和度与亮度风格统一（适合 UI 按钮、标签等）。

**参数**：
- `count` (number) - 生成数量，默认 `1`。
- `format` (`'hex'|'rgb'|'rgba'`) - 输出格式，默认 `'hex'`。
- `brightness` (0..1) - 映射到 HSL.light，值越大越亮。
- `alpha` (0..1) - 当 `format='rgba'` 时生效。

示例：
```ts
// 生成 3 个 rgba 颜色（透明度 0.6）
generateColors({ count: 3, format: 'rgba', brightness: 0.9, alpha: 0.6 })
```

---

## 核心 API（参考）

### 生成与调色板 🔧

| 函数 | 参数 | 返回 | 说明 |
|---|---|---:|---|
| `generateColors(opts)` | `{ count?: number; format?: 'hex'|'rgb'|'rgba'; brightness?: number; alpha?: number }` | `string[]` | 随机生成颜色，`brightness` 映射到 HSL.light，`alpha` 用于 `rgba` 输出 |
| `generateGradient(start, end, count?, opts?)` | `start:string, end:string, count?:number, opts?:{ format?: 'hex'|'rgb'|'rgba'; isCss?: boolean; alpha?: number; direction?: string }` | `string[]` | 从 start 到 end 线性插值，`isCss=true` 返回单项 `linear-gradient(...)` |
| `analogousPalette(hex, count, step?)` | `hex:string` | `string[]` | 生成类比色调色板 |

### 转换与工具 🛠️

| 函数 | 参数 | 返回 | 说明 |
|---|---|---:|---|
| `hexToRgbString(hex)` | `string` | `string` | `rgb(r, g, b)` |
| `hexToRgbaString(hex, alpha?)` | `string, number?` | `string` | `rgba(r, g, b, a)` |
| `rgbToRgbaString(rgbString, alpha?)` | `string, number?` | `string` | 将 `rgb(...)` 转为 `rgba(...)` |
| `rgbaToRgbString(rgbaString)` | `string` | `string` | 将 `rgba(...)` 转为 `rgb(...)` |
| `rgbStringToHex(s)` | `string` | `string` | `'#rrggbb'` |
| `rgbaStringToHex(s)` | `string` | `string` | 忽略 alpha，将 `rgba(...)` 转为 `'#rrggbb'` |
| `hexToHsl(hex)` | `string` | `{h,s,l}` | 十六进制转 HSL 对象 |

---

## 方法详解

下面对常用方法做简明说明（参数、返回与示例）。

### generateColors(opts)
- 描述：生成一组视觉上协调的颜色，默认风格偏亮且饱和，适合 UI 元素配色。
- 参数：`{ count?: number; format?: 'hex'|'rgb'|'rgba'; brightness?: number; alpha?: number }`
- 返回：`string[]`（按 `format` 返回 `hex`、`rgb(...)` 或 `rgba(...)` 字符串）
- 示例：
```ts
generateColors({ count: 3, format: 'rgba', brightness: 0.9, alpha: 0.6 })
```
- 注意：`brightness` 映射到 HSL.light，`alpha` 仅在 `format='rgba'` 时生效。

### generateGradient(start, end, count?, opts?)
- 描述：在 HSL 空间按线性插值生成从 `start` 到 `end` 的渐变色序列，可输出为颜色数组或 CSS `linear-gradient`。
- 参数：`start:string, end:string, count?:number, opts?:{ format?: 'hex'|'rgb'|'rgba'; isCss?: boolean; alpha?: number; direction?: string }`
- 返回：`string[]`，当 `isCss=true` 时返回单项 CSS 字符串数组
- 示例：
```ts
generateGradient('#ff0000', '#0000ff', 5)
generateGradient('#ff0000', '#0000ff', 5, { format: 'rgba', alpha: 0.5, isCss: true })
```

### analogousPalette(hex, count, step?)
- 描述：生成基于输入色的类比色调板（围绕色相相近的颜色序列）。
- 参数：`hex:string`（支持 `#f00` 或 `#ff0000`），`count:number`, `step?:number`
- 返回：`string[]`（hex）

### hexToRgbString(hex)
- 描述：将 3 或 6 位 hex（`#f00` / `#ff0000`）转换为 `rgb(r, g, b)` 字符串。
- 参数：`hex:string`
- 返回：`string`，例如 `'rgb(51, 102, 153)'`

### hexToRgbaString(hex, alpha?)
- 描述：同上但返回 `rgba(r, g, b, a)`，`alpha` 范围 0..1，默认 1。
- 示例：`hexToRgbaString('#336699', 0.25) // 'rgba(51, 102, 153, 0.25)'`

### rgbToRgbaString(rgbString, alpha?)
- 描述：将 `rgb(...)` 字符串转换为 `rgba(...)`，可指定 `alpha`。
- 示例：`rgbToRgbaString('rgb(10,20,30)', 0.3) // 'rgba(10, 20, 30, 0.3)'`

### rgbaToRgbString(rgbaString)
- 描述：将 `rgba(...)` 转为 `rgb(...)`（丢弃 alpha）。
- 示例：`rgbaToRgbString('rgba(10,20,30,0.1)') // 'rgb(10, 20, 30)'`

### rgbStringToHex(s)
- 描述：将 `rgb(...)` 转为小写 `'#rrggbb'`。
- 示例：`rgbStringToHex('rgb(255,0,128)') // '#ff0080'`

### rgbaStringToHex(s)
- 描述：将 `rgba(...)` 转为 `'#rrggbb'`（忽略 alpha）。
- 示例：`rgbaStringToHex('rgba(255,0,128,0.5)') // '#ff0080'`

### hexToHsl(hex)
- 描述：将 hex 转为 `{ h, s, l }` 对象，角度为度数，饱和度/亮度为 0-100 的整数。

### parseRgbString(s)
- 描述：解析 `rgb(...)` 或 `rgba(...)` 字符串为 `{ r,g,b,a? }` 对象，若输入不合法会抛出错误。

---

## 使用示例（更多）

- 生成带透明度的 rgba 列表：

```ts
generateColors({ count: 3, format: 'rgba', brightness: 0.9, alpha: 0.6 })
// -> ['rgba( ... ,0.6)', ...]
```

- 渐变输出为 CSS：

```ts
generateGradient('#ff0000', '#0000ff', 5, { format: 'rgba', alpha: 0.5, isCss: true })
// -> ['linear-gradient(90deg, rgba(...,0.5) 0%, ..., rgba(...,0.5) 100%)']
```


### 颜色格式互转
- hexToRgbString(hex) -> 'rgb(r,g,b)'
- hexToRgbaString(hex, alpha?) -> 'rgba(r,g,b,a)'
- rgbToRgbaString('rgb(r,g,b)', alpha?) -> 'rgba(r,g,b,a)'
- rgbaToRgbString('rgba(r,g,b,a)') -> 'rgb(r,g,b)'
- rgbStringToHex('rgb(r,g,b)') -> '#rrggbb'
- 解析函数：parseRgbString 可以解析 `rgb(...)` 或 `rgba(...)` 字符串为 {r,g,b,a}

```ts
hexToRgbString('#336699') // 'rgb(51, 102, 153)'
hexToRgbaString('#336699', 0.25) // 'rgba(51, 102, 153, 0.25)'
rgbStringToHex('rgb(255,0,128)') // '#ff0080'
rgbaStringToHex('rgba(255,0,128,0.5)') // '#ff0080'
```

### 渐变生成
- generateGradient(startHex, endHex, count = 5, { format = 'hex', isCss = false, alpha, direction })
  - startHex / endHex: 3 或 6 位 hex（如 `#f00` 或 `#ff0000`）
  - count: 生成的颜色数（整数，>=1）；当 `count>=2` 时包含两端颜色
  - format: 输出格式 `hex` | `rgb` | `rgba`
  - isCss: 如果为 `true`，函数返回数组包含单个 CSS 渐变字符串（`linear-gradient(...)`）
  - alpha: 当 `format='rgba'` 时可指定透明度

示例：
```ts
// 返回颜色数组
generateGradient('#ff0000', '#0000ff', 5)
// 返回 CSS 渐变字符串（数组内单项）
generateGradient('#ff0000', '#0000ff', 5, { isCss: true })
```

## 贡献
欢迎 PR：添加更多颜色空间（HSV、LAB）、更多调色板生成算法、以及示例和测试（推荐使用 `vitest`）。

---

## 许可证

MIT
