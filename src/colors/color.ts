export type RGB = { r: number; g: number; b: number }
export type HSL = { h: number; s: number; l: number }

const clamp = (v: number, a = 0, b = 255) => Math.max(a, Math.min(b, v))

export function hexToRgb(hex: string): RGB {
  const normalized = hex.replace(/^#/, '')
  if (normalized.length === 3) {
    const [r, g, b] = normalized.split('')
    const rr = r + r
    const gg = g + g
    const bb = b + b
    return {
      r: parseInt(rr, 16),
      g: parseInt(gg, 16),
      b: parseInt(bb, 16),
    }
  }
  if (normalized.length === 6) {
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16),
    }
  }
  throw new Error('Invalid hex color')
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => clamp(Math.round(n)).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  // convert r,g,b [0,255] to [0,1]
  const rr = r / 255
  const gg = g / 255
  const bb = b / 255
  const max = Math.max(rr, gg, bb)
  const min = Math.min(rr, gg, bb)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rr:
        h = (gg - bb) / d + (gg < bb ? 6 : 0)
        break
      case gg:
        h = (bb - rr) / d + 2
        break
      case bb:
        h = (rr - gg) / d + 4
        break
    }
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hh = ((h % 360) + 360) % 360 / 360
  const ss = s / 100
  const ll = l / 100

  if (ss === 0) {
    const v = Math.round(ll * 255)
    return { r: v, g: v, b: v }
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss
  const p = 2 * ll - q
  const r = hue2rgb(p, q, hh + 1 / 3)
  const g = hue2rgb(p, q, hh)
  const b = hue2rgb(p, q, hh - 1 / 3)

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex))
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl))
}

export function randomHex(): string {
  const rnd = () => Math.floor(Math.random() * 256)
  return rgbToHex({ r: rnd(), g: rnd(), b: rnd() })
}

export function complementaryHex(hex: string): string {
  const hsl = hexToHsl(hex)
  hsl.h = (hsl.h + 180) % 360
  return hslToHex(hsl)
}

export type ColorFormat = 'hex' | 'rgb' | 'rgba'

/**
 * 生成颜色（支持 count、输出类型、亮度和 alpha）
 * - count: 要生成的颜色数量
 * - format: 'hex'|'rgb'|'rgba'
 * - brightness: 0..1, 1 为最亮（会映射到 HSL.light）
 * - alpha: 针对 rgba 输出的 alpha 值（0..1）
 * 生成风格参考 macOS 常见配色（较高饱和度与偏亮）
 */
export function generateColors(opts?: { count?: number; format?: ColorFormat; brightness?: number; alpha?: number }): string[] {
  const count = opts?.count ?? 1
  const format = opts?.format ?? 'hex'
  const brightness = Math.max(0, Math.min(1, opts?.brightness ?? 0.8))
  const alpha = typeof opts?.alpha === 'number' ? Math.max(0, Math.min(1, opts!.alpha)) : 1

  const colors: string[] = []
  for (let i = 0; i < count; i++) {
    const h = Math.floor(Math.random() * 360)
    // mac-like: moderately high saturation
    const s = 60 + Math.random() * 25 // 60-85
    // map brightness 0..1 to light roughly 40..95
    const l = 40 + brightness * 50 + (Math.random() * 10 - 5)

    const hex = hslToHex({ h: Math.round(h), s: Math.round(s), l: Math.round(l) })

    if (format === 'hex') {
      colors.push(hex)
    } else {
      const { r, g, b } = hexToRgb(hex)
      if (format === 'rgb') colors.push(`rgb(${r}, ${g}, ${b})`)
      else colors.push(`rgba(${r}, ${g}, ${b}, ${alpha})`)
    }
  }
  return colors
}

export function hexToRgbString(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * 将 hex 转为 rgba 字符串（alpha 默认为 1）
 */
export function hexToRgbaString(hex: string, alpha = 1): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`
}

export function rgbToRgbaString(s: string, alpha = 1): string {
  const { r, g, b } = parseRgbString(s)
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`
}

export function rgbaToRgbString(s: string): string {
  const { r, g, b } = parseRgbString(s)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * 解析 rgb/rgba 字符串为 {r,g,b,a?}
 */
export function parseRgbString(s: string): { r: number; g: number; b: number; a?: number } {
  const m = s.match(/rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)/i)
  if (!m) throw new Error('Invalid rgb(a) string')
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a: m[4] === undefined ? undefined : Number(m[4]) }
}

export function rgbStringToHex(s: string): string {
  const { r, g, b } = parseRgbString(s)
  return rgbToHex({ r, g, b })
}

export function rgbaStringToHex(s: string): string {
  const { r, g, b } = parseRgbString(s)
  return rgbToHex({ r, g, b })
}

// ----- Gradients -----

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function lerpHue(a: number, b: number, t: number) {
  // shortest direction interpolation on a circle
  let d = ((b - a + 540) % 360) - 180
  return (a + d * t + 360) % 360
}

/**
 * 生成从 start 到 end 的渐变色数组
 * - start/end: 支持 3/6 位 hex（eg. #f00, #ff0000）
 * - count: 生成的颜色数（>=2 时包含两端）
 * - opts.format: 'hex'|'rgb'|'rgba'
 * - opts.isCss: 如果 true，返回数组包含单个 CSS 渐变字符串（linear-gradient）
 */
export function generateGradient(
  start: string,
  end: string,
  count = 5,
  opts?: { format?: ColorFormat; isCss?: boolean; alpha?: number; direction?: string }
): string[] {
  if (count <= 0) return []
  const format = opts?.format ?? 'hex'
  const isCss = !!opts?.isCss
  const alpha = typeof opts?.alpha === 'number' ? Math.max(0, Math.min(1, opts!.alpha)) : 1
  const direction = opts?.direction ?? '90deg'

  const hs = hexToHsl(start)
  const he = hexToHsl(end)

  const colors: string[] = []
  if (count === 1) {
    const hex = hslToHex({ h: Math.round(hs.h), s: Math.round(hs.s), l: Math.round(hs.l) })
    if (isCss) return [`linear-gradient(${direction}, ${formatHexForExport(hex, format, alpha)} 0%)`]
    return [formatHexForExport(hex, format, alpha)]
  }

  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1)
    const h = Math.round(lerpHue(hs.h, he.h, t))
    const s = Math.round(lerp(hs.s, he.s, t))
    const l = Math.round(lerp(hs.l, he.l, t))
    const hex = hslToHex({ h, s, l })
    colors.push(formatHexForExport(hex, format, alpha))
  }

  if (isCss) {
    const stops = colors.map((c, i) => `${c} ${Math.round((i / (colors.length - 1)) * 100)}%`)
    return [`linear-gradient(${direction}, ${stops.join(', ')})`]
  }
  return colors
}

function formatHexForExport(hex: string, format: ColorFormat, alpha = 1) {
  if (format === 'hex') return hex
  const { r, g, b } = hexToRgb(hex)
  if (format === 'rgb') return `rgb(${r}, ${g}, ${b})`
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

