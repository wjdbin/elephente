import { useEffect, useState } from 'react'

const DISMISS_KEY = 'elephente-install-dismissed'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  )
}

function isIos() {
  const ua = navigator.userAgent
  const iPhone = /iphone|ipad|ipod/i.test(ua)
  const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return iPhone || iPadOs
}

export function InstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [iosHint, setIosHint] = useState(false)
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISS_KEY) === '1') return

    if (isIos()) {
      setIosHint(true)
      setHidden(false)
      return
    }

    const onPrompt = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
      setHidden(false)
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1')
    setHidden(true)
  }

  async function install() {
    if (!deferred) return
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    if (outcome === 'accepted') setHidden(true)
  }

  if (hidden) return null

  return (
    <aside className="mb-4 rounded-2xl border border-line bg-white px-4 py-3 sm:px-5 md:mb-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-navy">앱으로 설치</p>
          <p className="mt-1 text-sm text-muted">
            {iosHint
              ? 'Safari 아래 공유 버튼에서 ‘홈 화면에 추가’를 누르면 됩니다.'
              : '홈 화면에 두면 카톡 링크 없이 바로 열 수 있어요.'}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-xs font-medium text-muted hover:text-navy"
          aria-label="설치 안내 닫기"
        >
          닫기
        </button>
      </div>
      {deferred && (
        <button
          type="button"
          onClick={install}
          className="mt-3 inline-flex h-10 items-center rounded-full bg-brand px-4 text-sm font-semibold text-white"
        >
          설치하기
        </button>
      )}
    </aside>
  )
}
