import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const W = 1200
const H = 630

const fontBold = fs.readFileSync('C:/Windows/Fonts/malgunbd.ttf').toString('base64')
const fontReg = fs.readFileSync('C:/Windows/Fonts/malgun.ttf').toString('base64')

const elpeni = await sharp(path.join(root, 'public/elpeni/home.png'))
  .resize({ height: 560, fit: 'inside' })
  .toBuffer()

const logo = await sharp(path.join(root, 'public/logo.png'))
  .resize({ height: 118, fit: 'inside' })
  .toBuffer()

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'OgBold';
        src: url('data:font/ttf;base64,${fontBold}') format('truetype');
        font-weight: 700;
      }
      @font-face {
        font-family: 'OgReg';
        src: url('data:font/ttf;base64,${fontReg}') format('truetype');
        font-weight: 400;
      }
    </style>
  </defs>
  <rect width="${W}" height="${H}" fill="#fffbf7"/>
  <rect x="48" y="72" width="760" height="486" rx="48" fill="#f5821f"/>
  <text x="88" y="268" font-family="OgReg" font-size="26" letter-spacing="6" fill="#ffffff" fill-opacity="0.9">FC ELEPHENTE</text>
  <text x="88" y="360" font-family="OgBold" font-size="72" fill="#ffffff">엘펜그라운드</text>
  <text x="88" y="430" font-family="OgReg" font-size="32" fill="#ffffff" fill-opacity="0.92">정모 · WUFL · SUFA</text>
  <text x="88" y="500" font-family="OgReg" font-size="24" fill="#ffffff" fill-opacity="0.8">오늘 시간 · 장소, 한곳에서</text>
</svg>
`

await sharp(Buffer.from(svg))
  .png()
  .composite([
    { input: logo, left: 80, top: 104 },
    { input: elpeni, left: 740, top: 42 },
  ])
  .toFile(path.join(root, 'public/og.png'))

console.log('wrote public/og.png')
