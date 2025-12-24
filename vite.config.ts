import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ColorTransform',
      fileName: 'color-transform',
      formats: ['es', 'cjs']
    }
  }
})
