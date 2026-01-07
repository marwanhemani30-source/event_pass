import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { errorHandler } from './utils/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// ✅ utile dès qu'on fait des POST JSON
app.use(express.json())

// Simple root + health endpoints
app.get('/', (_req, res) => res.json({ ok: true, message: 'Hello from CI/CD demo 👋' }))
app.get('/health', (_req, res) => res.status(200).send('OK'))

// Auto-mount all routers placed under src/routes/auto
const autoDir = path.join(__dirname, 'routes', 'auto')
if (fs.existsSync(autoDir)) {
  const files = fs.readdirSync(autoDir).filter(f => f.endsWith('.route.js'))

  for (const f of files) {
    const full = path.join(autoDir, f)

    // ✅ ESM-friendly import (marche aussi avec des modules CJS)
    const mod = await import(pathToFileURL(full).href)
    const router = mod.default ?? mod

    if (typeof router !== 'function') {
      console.warn(`[WARN] ${f} n'exporte pas un router Express. Reçu:`, typeof router)
      continue
    }

    app.use('/', router)
  }
}

// Global error middleware last
app.use(errorHandler)

export default app
