#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const exts = new Set(['.jpg', '.jpeg', '.png'])

/** Recursively walk a directory and collect file paths */
function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(full)
    } else {
      yield full
    }
  }
}

async function convertToWebp(srcPath) {
  const rel = path.relative(PUBLIC_DIR, srcPath)
  const ext = path.extname(srcPath).toLowerCase()
  if (!exts.has(ext)) return

  const destPath = path.join(PUBLIC_DIR, rel).replace(/\.(jpg|jpeg|png)$/i, '.webp')
  const srcStat = fs.statSync(srcPath)
  let needs = true
  if (fs.existsSync(destPath)) {
    const dstStat = fs.statSync(destPath)
    needs = srcStat.mtimeMs > dstStat.mtimeMs
  }
  if (!needs) return

  try {
    await sharp(srcPath)
      .webp({ quality: 80 })
      .toFile(destPath)
    console.log('WebP:', path.relative(process.cwd(), destPath))
  } catch (err) {
    console.warn(`Skipping ${path.relative(process.cwd(), srcPath)}: ${err.message}`)
  }
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) return
  const tasks = []
  for (const file of walk(PUBLIC_DIR)) {
    tasks.push(convertToWebp(file))
  }
  await Promise.all(tasks)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

