import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function waifusApiPlugin() {
  const dataPath = path.join(__dirname, 'src', 'data', 'red_waifus.json')

  const getWaifusData = () => {
    try {
      if (fs.existsSync(dataPath)) {
        return JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
      }
    } catch (err) {
      console.error('Error loading red_waifus.json in Vite middleware:', err)
    }
    return []
  }

  return {
    name: 'waifus-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
        if (url.pathname === '/api/waifus') {
          if (req.method !== 'GET') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }

          const page = Math.max(1, parseInt(url.searchParams.get('page'), 10) || 1)
          const limit = Math.max(1, parseInt(url.searchParams.get('limit'), 10) || 20)
          const origin = (url.searchParams.get('origin') || '').trim().toLowerCase()
          const search = (url.searchParams.get('search') || '').trim().toLowerCase()

          let filtered = getWaifusData()

          if (origin && origin !== 'all') {
            filtered = filtered.filter((item) => item.origin.toLowerCase() === origin)
          }

          if (search) {
            filtered = filtered.filter(
              (item) =>
                item.name.toLowerCase().includes(search) ||
                item.series.toLowerCase().includes(search)
            )
          }

          const total = filtered.length
          const totalPages = Math.ceil(total / limit) || 1
          const startIndex = (page - 1) * limit
          const endIndex = startIndex + limit
          const items = filtered.slice(startIndex, endIndex)
          const hasNextPage = page < totalPages

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              items,
              total,
              page,
              limit,
              totalPages,
              hasNextPage,
            })
          )
          return
        }

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), waifusApiPlugin()],
  server: {
    proxy: {
      '/nekos': {
        target: 'https://nekos.best',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nekos/, ''),
      },
    },
  },
})