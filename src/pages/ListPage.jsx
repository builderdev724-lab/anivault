import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, CheckSquare, Square, Plus, Copy, Download, Inbox } from 'lucide-react'
import AnimeCard from '../components/AnimeCard'
import { ALL_STATUS, toCSV } from '../utils/parseHTML'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently added' },
  { value: 'title', label: 'Title A–Z' },
  { value: 'status', label: 'Status' },
]

export default function ListPage({ list }) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('recent')
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState(new Set())

  const counts = useMemo(() => {
    const c = { All: list.rows.length }
    ALL_STATUS.forEach((s) => (c[s] = 0))
    list.rows.forEach((r) => (c[r.status] = (c[r.status] || 0) + 1))
    return c
  }, [list.rows])

  const filtered = useMemo(() => {
    let items = list.rows.map((r, idx) => ({ ...r, idx }))
    if (filter !== 'All') items = items.filter((r) => r.status === filter)
    if (search) items = items.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))

    if (sort === 'title') {
      items = [...items].sort((a, b) => a.title.localeCompare(b.title))
    } else if (sort === 'status') {
      items = [...items].sort((a, b) => ALL_STATUS.indexOf(a.status) - ALL_STATUS.indexOf(b.status))
    } else {
      items = [...items].reverse()
    }
    return items
  }, [list.rows, filter, search, sort])

  function toggleSelectMode() {
    setSelectMode((v) => !v)
    setSelected(new Set())
  }

  function toggleSelected(idx) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  function handleBulkDelete() {
    list.removeMany([...selected])
    setSelected(new Set())
    setSelectMode(false)
  }

  function handleBulkStatus(status) {
    if (!status) return
    list.updateManyStatus([...selected], status)
    setSelected(new Set())
    setSelectMode(false)
  }

  function handleCopy() {
    navigator.clipboard.writeText(toCSV(list.rows))
  }

  function handleDownload() {
    const blob = new Blob([toCSV(list.rows)], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'anivault-list.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page">
      <div className="topbar">
        <button className="icon-btn" onClick={() => navigate('/')} aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <h2>My List</h2>
        <button
          className={'icon-btn' + (selectMode ? ' active' : '')}
          onClick={toggleSelectMode}
          aria-label="Toggle select mode"
          style={selectMode ? { background: 'var(--accent-soft)', borderColor: 'var(--accent-light)', color: 'var(--accent-2)' } : {}}
        >
          {selectMode ? <CheckSquare size={18} /> : <Square size={18} />}
        </button>
      </div>

      <div className="search-wrap">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            className="search"
            placeholder="Search titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="toolbar-row">
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Sort: {o.label}
            </option>
          ))}
        </select>
        <span style={{ fontSize: '.76rem', color: 'var(--ink-faint)', fontWeight: 600 }}>
          {filtered.length} shown
        </span>
      </div>

      <div className="tabs">
        {['All', ...ALL_STATUS].map((c) => (
          <div key={c} className={'tab' + (filter === c ? ' active' : '')} onClick={() => setFilter(c)}>
            {c} ({counts[c] || 0})
          </div>
        ))}
      </div>

      {selectMode && selected.size > 0 && (
        <div className="selection-bar">
          <span>{selected.size} selected</span>
          <div className="spacer"></div>
          <select onChange={(e) => handleBulkStatus(e.target.value)} defaultValue="">
            <option value="" disabled>
              Set status...
            </option>
            {ALL_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button className="danger" onClick={handleBulkDelete}>
            Delete
          </button>
        </div>
      )}

      <div className="page-scroll" style={{ paddingTop: 0 }}>
        <div className="card-list">
          {list.rows.length === 0 ? (
            <div className="empty">
              <Inbox size={28} strokeWidth={1.6} />
              <b>Your list is empty</b>
              Go to Home and import from a site, or add a row here.
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty">No entries match this filter.</div>
          ) : (
            filtered.map((entry) => (
              <AnimeCard
                key={entry.idx}
                entry={entry}
                selectMode={selectMode}
                selected={selected.has(entry.idx)}
                onToggleSelect={() => toggleSelected(entry.idx)}
                onTitleChange={(v) => list.updateTitle(entry.idx, v)}
                onStatusChange={(v) => list.updateStatus(entry.idx, v)}
                onDelete={() => list.removeRow(entry.idx)}
              />
            ))
          )}
        </div>
      </div>

      <div className="fab-row">
        <button onClick={list.addRow}>
          <Plus size={15} /> Add row
        </button>
        <button onClick={handleCopy}>
          <Copy size={15} /> Copy CSV
        </button>
        <button className="primary" onClick={handleDownload}>
          <Download size={15} /> Download
        </button>
      </div>
    </div>
  )
}
