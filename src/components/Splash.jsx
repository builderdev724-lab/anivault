import { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react'

export default function Splash() {
  const [hide, setHide] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHide(true), 1600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={'splash' + (hide ? ' hide' : '')} onClick={() => setHide(true)}>
      <div className="splash-badge">
        <Bookmark size={38} strokeWidth={2.2} />
      </div>
      <h1>AniVault</h1>
      <p>Your watchlist, backed up and yours</p>
      <div className="splash-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}
