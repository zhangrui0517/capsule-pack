import { defineConfig, normalizePath } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import postcssPresetEnv  from 'postcss-preset-env'

const variablePath = normalizePath(path.resolve('./src/variable.scss'));

export default defineConfig({
  plugins: [react()],
  root: './src',
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv({ browsers: 'ie 9' })
      ]
    },
    modules: {
      generateScopedName: '[name]-[local]-[hash:base64:5]'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${variablePath}";`
      }
    }
  }
})
