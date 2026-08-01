import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/my-galaxy/',
  plugins: [
    svelte(),
    tailwind()
  ],
})
