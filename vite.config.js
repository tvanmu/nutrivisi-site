import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import contactHandler from './api/contact.js'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'nutrivisi-local-contact-api',
      configureServer(server) {
        server.middlewares.use('/api/contact', async (req, res, next) => {
          try {
            await contactHandler(req, res)
          } catch (error) {
            next(error)
          }
        })
      },
    },
  ],
})
