import { defineConfig } from 'vite'
const path = require('path')
import glslifyCompiler from 'vite-plugin-glslify'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'views': path.resolve(__dirname, 'src/js/views'),
      'shaders': path.resolve(__dirname, 'src/js/shaders'),
      'workers': path.resolve(__dirname, 'src/js/workers')
    },
  },
  plugins: [
    glslifyCompiler(),
  ]
})
