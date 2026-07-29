import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, ListChecks, Inbox } from 'lucide-react'
import StatCard from '../components/StatCard'

const STATUS_LIST = ['Watching', 'Planned', 'On-Hold', 'Watched', 'Dropped']

export default function Home({ list }) {
  const navigate = useNavigate()
  const [html, setHtml] = useState('')
  const [msg, setMsg] = useState(null)

  const counts = Object.fromEntries(STATUS_LIST.map((s) => [s, 0]))
  list.rows.forEach((r) => {
    if (counts[r.status] !== undefined) counts[r.status]++
  })

  const recent = [...list.rows].slice(-5).reverse()

  function handleParse() {
    if (!html.trim()) {
      setMsg({ text: 'Paste some HTML first', type: 'warn' })
      return
    }
    const { found, added } = list.importFromHTML(html)
    if (found === 0) {
      setMsg({ text: 'No entries found — try the full page source', type: 'warn' })
      return
    }
    setMsg({ text: `Added ${added} new (${found - added} already saved)`, type: 'ok' })
    setTimeout(() => setMsg(null), 3000)
  }

  return (
    <div className="page">
      <div className="topbar">
        <h2>
          <span className="icon-wrap">
            <Bookmark size={16} strokeWidth={2.4} />
          </span>
          AniVault
        </h2>
        <div className="save-pill">
          <span
            className="dot"
            style={{
              background:
                list.saveStatus === 'error'
                  ? 'var(--hold)'
                  : list.saveStatus === 'saving'
                    ? 'var(--planned)'
                    : 'var(--watched)',
            }}
          ></span>
          {list.saveStatus === 'error' ? 'Storage unavailable' : 'Saved on this device'}
        </div>
      </div>

      <div className="page-scroll">
        <div className="hero">
          <p>Import a watchlist from any site, keep it here, filter it your way — all stored right on this device.</p>
        </div>

        <div className="stat-grid">
          {STATUS_LIST.map((s) => (
            <StatCard key={s} status={s} count={counts[s]} />
          ))}
        </div>

        <button className="big-btn" onClick={() => navigate('/list')}>
          <ListChecks size={18} strokeWidth={2.4} />
          View my full list
        </button>

        <div className="section-title">Import from a site</div>
        <div className="import-panel">
          <div className="import-steps">
            <b>1.</b> Open your list on the source site, log in, go to your watchlist page.
            <br />
            <b>2.</b> Right-click → View Page Source (or Ctrl/⌘+U) → select all → copy.
            <br />
            <b>3.</b> Paste below — new titles get merged in, duplicates are skipped.
          </div>
          <textarea
            placeholder="Paste page HTML here..."
            value={html}
            onChange={(e) => setHtml(e.target.value)}
          />
          <div className="row">
            <button onClick={handleParse}>Parse &amp; add</button>
            <button className="ghost" onClick={() => setHtml('')}>
              Clear
            </button>
            {msg && <span className={'msg ' + msg.type}>{msg.text}</span>}
          </div>
        </div>

        <div className="section-title">Recently added</div>
        {recent.length === 0 ? (
          <div className="empty">
            <Inbox size={28} strokeWidth={1.6} />
            <b>Nothing yet</b>
            Paste a page source above to get started.
          </div>
        ) : (
          <div className="preview-list">
            {recent.map((r, i) => (
              <div key={i} className={'mini-row st-' + r.status}>
                <span className="t">{r.title || '(untitled)'}</span>
                <span className="badge">{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
