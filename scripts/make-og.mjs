import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'public/og-source.jpg')
const out = path.join(root, 'public/og.png')

await sharp(source)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .png()
  .toFile(out)

console.log('wrote public/og.png')
