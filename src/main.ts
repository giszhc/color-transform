import './style.css'
import { generateColors, generateGradient, randomHex, complementaryHex, hexToHsl, analogousPalette, hexToRgb } from './colors'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <div>
    <h1>@giszhc/color-transform 演示</h1>

    <div class="playground">
      <aside class="card controls" role="region" aria-label="controls">
        <div class="control-row">
          <div class="form-field">
            <label for="hexInput">颜色</label>
            <div class="input-row">
              <input id="hexInput" type="text" placeholder="例如 #ff0000 或 #f00" aria-label="颜色（十六进制）" />
              <button id="randomBtn" class="primary">随机</button>
            </div>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-field">
            <label for="countInput">数量</label>
            <input id="countInput" type="number" min="1" max="50" value="1" />
          </div>
          <div class="form-field">
            <label for="formatSelect">类型</label>
            <select id="formatSelect">
              <option value="hex">hex</option>
              <option value="rgb">rgb</option>
              <option value="rgba">rgba</option>
            </select>
          </div>
          <div class="form-field">
            <label for="brightnessInput">亮度</label>
            <input id="brightnessInput" type="range" min="0" max="1" step="0.01" value="0.8" />
          </div>
          <div class="form-field">
            <label for="alphaInput">alpha</label>
            <input id="alphaInput" type="number" min="0" max="1" step="0.01" value="1" />
          </div>
        </div>

        <div class="form-grid">
          <div class="form-field">
            <label for="startInput">起始色</label>
            <input id="startInput" type="text" placeholder="#start" />
          </div>
          <div class="form-field">
            <label for="endInput">结束色</label>
            <input id="endInput" type="text" placeholder="#end" />
          </div>
          <div class="form-field">
            <label for="isCssInput">CSS 输出</label>
            <input id="isCssInput" type="checkbox" />
          </div>
        </div>

        <div class="control-actions">
          <div style="flex:1 1 auto; display:flex; gap:8px;">
            <button id="compBtn">互补色</button>
            <button id="analogBtn">类比调色板</button>
          </div>
          <div style="flex:0 0 140px">
            <button id="gradientBtn" class="primary full">生成渐变</button>
          </div>
        </div>

        <p class="help">说明：点击颜色块可复制，使用“生成渐变”可输出颜色数组或 CSS 背景字符串。</p>
      </aside>

      <section class="card display" id="display" role="region" aria-label="preview">
        <div id="previewBox" class="preview-box" aria-hidden="true"></div>
        <div id="swatches" class="swatches" aria-live="polite"></div>
        <div id="info" class="info" aria-live="polite"></div>
      </section>
    </div>
  </div>
`

const hexInput = document.querySelector<HTMLInputElement>('#hexInput')!
const countInput = document.querySelector<HTMLInputElement>('#countInput')!
const formatSelect = document.querySelector<HTMLSelectElement>('#formatSelect')!
const brightnessInput = document.querySelector<HTMLInputElement>('#brightnessInput')!
const alphaInput = document.querySelector<HTMLInputElement>('#alphaInput')!
const startInput = document.querySelector<HTMLInputElement>('#startInput')!
const endInput = document.querySelector<HTMLInputElement>('#endInput')!
const isCssInput = document.querySelector<HTMLInputElement>('#isCssInput')!
const randomBtn = document.querySelector<HTMLButtonElement>('#randomBtn')!
const compBtn = document.querySelector<HTMLButtonElement>('#compBtn')!
const analogBtn = document.querySelector<HTMLButtonElement>('#analogBtn')!
const gradientBtn = document.querySelector<HTMLButtonElement>('#gradientBtn')!
const swatches = document.querySelector<HTMLDivElement>('#swatches')!
const previewBox = document.querySelector<HTMLDivElement>('#previewBox')!
const info = document.querySelector<HTMLDivElement>('#info')!

function isValidHex(v: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)
}

function clearChildren(el: Element) {
  while (el.firstChild) el.removeChild(el.firstChild)
}

function makeSwatch(color: string) {
  const d = document.createElement('div')
  d.className = 'swatch'
  d.style.background = color
  d.setAttribute('role', 'button')
  d.tabIndex = 0

  const label = document.createElement('div')
  label.className = 'label'
  label.textContent = color
  d.appendChild(label)

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(color)
      info.textContent = `已复制 ${color} 到剪贴板`
    } catch {
      info.textContent = `颜色：${color}`
    }
    d.classList.add('copied')
    setTimeout(() => d.classList.remove('copied'), 900)
  }

  d.addEventListener('click', doCopy)
  d.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      doCopy()
    }
  })

  return d
}

function showColor(hex: string) {
  clearChildren(swatches)
  const comp = complementaryHex(hex)
  const palette = analogousPalette(hex, 5)

  swatches.appendChild(makeSwatch(hex))
  swatches.appendChild(makeSwatch(comp))
  for (const p of palette) swatches.appendChild(makeSwatch(p))

  const hsl = hexToHsl(hex)
  info.textContent = `Hex: ${hex} | HSL: h=${hsl.h} s=${hsl.s}% l=${hsl.l}%`
}

randomBtn.addEventListener('click', () => {
  const count = Math.max(1, Math.min(50, Number(countInput.value) || 1))
  const format = formatSelect.value as 'hex' | 'rgb' | 'rgba'
  const brightness = Number(brightnessInput.value)
  const alpha = Number(alphaInput.value)
  const colors = generateColors({ count, format, brightness, alpha })
  clearChildren(swatches)
  colors.forEach((c) => swatches.appendChild(makeSwatch(c)))
  if (format === 'hex' && colors.length > 0) hexInput.value = colors[0]

  // preview: if multiple colors, show gradient; otherwise show single color
  if (colors.length > 1) {
    previewBox.style.background = `linear-gradient(90deg, ${colors.join(', ')})`
  } else {
    previewBox.style.background = colors[0]
  }

  info.textContent = `生成 ${colors.length} 个颜色（${format}），亮度 ${brightness}`
})

compBtn.addEventListener('click', () => {
  const val = hexInput.value.trim() || randomHex()
  if (!isValidHex(val)) {
    info.textContent = '请输入有效的 HEX（例如 #ff0000）'
    return
  }
  const c = complementaryHex(val)
  hexInput.value = c
  // format the complementary color according to selected output
  const format = formatSelect.value as 'hex' | 'rgb' | 'rgba'
  const alpha = Number(alphaInput.value)
  clearChildren(swatches)
  const formatted = formatHex(c, format, alpha)
  swatches.appendChild(makeSwatch(formatted))
  previewBox.style.background = formatted
  info.textContent = `互补色：${formatted}`
})

analogBtn.addEventListener('click', () => {
  const val = hexInput.value.trim() || randomHex()
  if (!isValidHex(val)) {
    info.textContent = '请输入有效的 HEX（例如 #ff0000）'
    return
  }
  const count = Math.max(1, Math.min(20, Number(countInput.value) || 5))
  const alpha = Number(alphaInput.value)
  const format = formatSelect.value as 'hex' | 'rgb' | 'rgba'

  // generate an analogous palette with `count` colors
  const palette = analogousPalette(val, count)
  clearChildren(swatches)
  if (format === 'hex') {
    palette.forEach((p) => swatches.appendChild(makeSwatch(p)))
    previewBox.style.background = `linear-gradient(90deg, ${palette.join(', ')})`
    info.textContent = `类比调色板：${palette.join(', ')}`
  } else {
    // convert to requested format using helper
    const converted = palette.map((p) => formatHex(p, format, alpha))
    converted.forEach((c) => swatches.appendChild(makeSwatch(c)))
    previewBox.style.background = `linear-gradient(90deg, ${converted.join(', ')})`
    info.textContent = `类比调色板（${format}）：${converted.join(', ')}`
  }
  hexInput.value = val
})

gradientBtn.addEventListener('click', () => {
  const start = startInput.value.trim() || hexInput.value.trim() || randomHex()
  const end = endInput.value.trim() || randomHex()
  if (!isValidHex(start) || !isValidHex(end)) {
    info.textContent = '请输入有效的起始和结束 HEX 颜色'
    return
  }
  const count = Math.max(2, Math.min(50, Number(countInput.value) || 5))
  const format = formatSelect.value as 'hex' | 'rgb' | 'rgba'
  const alpha = Number(alphaInput.value)
  const isCss = Boolean(isCssInput.checked)
  const res = generateGradient(start, end, count, { format, alpha, isCss })
  clearChildren(swatches)
  if (isCss) {
    previewBox.style.background = res[0]
    info.textContent = `CSS 渐变：${res[0]}`
  } else {
    res.forEach((c) => swatches.appendChild(makeSwatch(c)))
    previewBox.style.background = `linear-gradient(90deg, ${res.join(', ')})`
    info.textContent = `渐变生成：${res.join(', ')}`
  }
})

hexInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const v = hexInput.value.trim()
    if (!isValidHex(v)) {
      info.textContent = '请输入有效的 HEX（例如 #ff0000）'
      return
    }
    showColor(v)
  }
})

// initialize with a random color
const initial = randomHex()
hexInput.value = initial
showColor(initial)
// set defaults for start/end inputs and preview
startInput.value = initial
endInput.value = complementaryHex(initial)
previewBox.style.background = `linear-gradient(90deg, ${startInput.value}, ${endInput.value})`

// live preview updates
hexInput.addEventListener('input', () => {
  const v = hexInput.value.trim()
  if (isValidHex(v)) previewBox.style.background = v
})

;[startInput, endInput].forEach((inp) => {
  inp.addEventListener('input', () => {
    if (isValidHex(startInput.value) && isValidHex(endInput.value)) {
      previewBox.style.background = `linear-gradient(90deg, ${startInput.value}, ${endInput.value})`
    }
  })
})

// helper to format hex into requested format
function formatHex(hex: string, format: 'hex' | 'rgb' | 'rgba', alpha = 1) {
  if (format === 'hex') return hex
  const { r, g, b } = hexToRgb(hex)
  if (format === 'rgb') return `rgb(${r}, ${g}, ${b})`
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// expose helpers for debugging convenience
;(window as any).colorSdkGenerate = generateColors
;(window as any).colorSdkHexToRgb = hexToRgb
;(window as any).colorSdkFormatHex = formatHex



