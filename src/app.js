import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { errorHandler } from './utils/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())

// API endpoints simples
app.get('/health', (_req, res) => res.status(200).send('OK'))
app.get('/api', (_req, res) =>
  res.json({ ok: true, message: 'PassEvent API running 🚀' })
)

// Auto-mount des routes API
const autoDir = path.join(__dirname, 'routes', 'auto')
if (fs.existsSync(autoDir)) {
  const files = fs.readdirSync(autoDir).filter(f => f.endsWith('.route.js'))

  for (const f of files) {
    const full = path.join(autoDir, f)
    const mod = await import(pathToFileURL(full).href)
    const router = mod.default ?? mod

    if (typeof router === 'function') {
      app.use('/', router)
    }
  }
}

// Middleware d'erreur en dernier
app.use(errorHandler)

export default app
