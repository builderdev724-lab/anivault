import { useState, useEffect, useCallback } from 'react'
import { parseAnimeListHTML } from '../utils/parseHTML'

const STORAGE_KEY = 'anivault-entries'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useAnimeList() {
  const [rows, setRows] = useState(loadFromStorage)
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | error

  useEffect(() => {
    setSaveStatus('saving')
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
      const t = setTimeout(() => setSaveStatus('saved'), 200)
      return () => clearTimeout(t)
    } catch {
      setSaveStatus('error')
    }
  }, [rows])

  const updateTitle = useCallback((idx, title) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, title } : r)))
  }, [])

  const updateStatus = useCallback((idx, status) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, status } : r)))
  }, [])

  const removeRow = useCallback((idx) => {
    setRows((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, { title: '', status: 'Watching' }])
  }, [])

  const importFromHTML = useCallback((htmlStr) => {
    const found = parseAnimeListHTML(htmlStr)
    let added = 0
    setRows((prev) => {
      const next = [...prev]
      found.forEach((f) => {
        const exists = next.some((r) => r.title.toLowerCase() === f.title.toLowerCase())
        if (!exists) {
          next.push(f)
          added++
        }
      })
      return next
    })
    return { found: found.length, added }
  }, [])

  const clearAll = useCallback(() => {
    setRows([])
  }, [])

  const removeMany = useCallback((indices) => {
    const toRemove = new Set(indices)
    setRows((prev) => prev.filter((_, i) => !toRemove.has(i)))
  }, [])

  const updateManyStatus = useCallback((indices, status) => {
    const toUpdate = new Set(indices)
    setRows((prev) => prev.map((r, i) => (toUpdate.has(i) ? { ...r, status } : r)))
  }, [])

  return {
    rows,
    saveStatus,
    updateTitle,
    updateStatus,
    removeRow,
    addRow,
    importFromHTML,
    clearAll,
    removeMany,
    updateManyStatus,
  }
}
