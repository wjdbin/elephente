import { useEffect, useState } from 'react'

const LINES = ['안녕 난 엘펜이야!', '우리 축구하자!!'] as const

export function ElpeniHome() {
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(true)

  useEffect(() => {
    let fade = 0
    const id = window.setInterval(() => {
      setShown(false)
      fade = window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % LINES.length)
        setShown(true)
      }, 220)
    }, 2800)
    return () => {
      window.clearInterval(id)
      window.clearTimeout(fade)
    }
  }, [])

  return (
    <div className="relative shrink-0">
      <div
        className={`absolute bottom-[calc(100%-0.15rem)] left-1/2 z-10 w-max max-w-[10.5rem] -translate-x-1/2 rounded-2xl border border-line bg-white px-3 py-1.5 text-center shadow-sm transition-opacity duration-200 ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-[11px] font-bold leading-snug text-navy sm:text-xs">{LINES[index]}</p>
        <span className="absolute left-1/2 top-full -mt-px h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-line bg-white" />
      </div>
      <img src="/elpeni/home.png" alt="엘펜이" className="h-36 w-auto sm:h-44 lg:h-52" />
    </div>
  )
}
