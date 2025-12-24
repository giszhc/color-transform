import { hexToHsl, hslToHex } from './color'

/**
 * 生成类似色调（analogous）调色板
 * - count: 调色板数量
 * - step: 相邻色相角度差（度）
 */
export function analogousPalette(hex: string, count = 5, step = 30): string[] {
  const hsl = hexToHsl(hex)
  const half = Math.floor(count / 2)
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    const h = (hsl.h + (i - half) * step + 360) % 360
    result.push(hslToHex({ h, s: hsl.s, l: hsl.l }))
  }
  return result
}
