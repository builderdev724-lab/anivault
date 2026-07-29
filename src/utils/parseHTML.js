const STATUS_MAP = [
  { keys: ['watching'], label: 'Watching' },
  { keys: ['planned', 'planning', 'plan to watch'], label: 'Planned' },
  { keys: ['on-hold', 'on hold', 'hold'], label: 'On-Hold' },
  { keys: ['dropped', 'remove', 'removed'], label: 'Dropped' },
  { keys: ['watched', 'completed', 'complete'], label: 'Watched' },
]

export const ALL_STATUS = ['Watching', 'Planned', 'On-Hold', 'Watched', 'Dropped', 'Unknown']

const IGNORED_LINK_TEXT =
  /^(login|register|home|filter|forgot password|submit|back to sign in|sign in|join now|contact|dmca|terms|request anime)$/i

function normalizeStatus(text) {
  const t = text.trim().toLowerCase()
  for (const g of STATUS_MAP) if (g.keys.includes(t)) return g.label
  return null
}

function extractTitleNear(statusEl) {
  let node = statusEl
  for (let depth = 0; depth < 8 && node; depth++) {
    node = node.parentElement
    if (!node) break

    const links = Array.from(node.querySelectorAll('a'))
    for (const a of links) {
      const txt = a.textContent.trim()
      if (!txt || normalizeStatus(txt) || txt.length < 2) continue
      if (IGNORED_LINK_TEXT.test(txt)) continue
      return { title: txt, container: node }
    }

    const heads = Array.from(node.querySelectorAll('h1,h2,h3,h4'))
    for (const h of heads) {
      const txt = h.textContent.trim()
      if (txt && !normalizeStatus(txt) && txt.length > 1) return { title: txt, container: node }
    }
  }
  return null
}

/**
 * Parses a full page's HTML source and returns [{ title, status }, ...]
 * by looking for short text nodes matching known status words, then
 * walking up the DOM to find the nearest title link or heading.
 */
export function parseAnimeListHTML(htmlStr) {
  const doc = new DOMParser().parseFromString(htmlStr, 'text/html')
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT)
  const results = []
  const usedContainers = new Set()
  const seenPairs = new Set()

  let el
  while ((el = walker.nextNode())) {
    if (el.children.length > 0) continue
    const txt = el.textContent.trim()
    if (!txt || txt.length > 20) continue

    const status = normalizeStatus(txt)
    if (!status) continue

    const found = extractTitleNear(el)
    if (!found || usedContainers.has(found.container)) continue

    const key = found.title + '||' + status
    if (seenPairs.has(key)) continue

    seenPairs.add(key)
    usedContainers.add(found.container)
    results.push({ title: found.title, status })
  }

  return results
}

export function toCSV(rows) {
  const lines = ['Title,Status']
  rows.forEach((r) => {
    lines.push(`"${r.title.replace(/"/g, '""')}","${r.status.replace(/"/g, '""')}"`)
  })
  return lines.join('\n')
}
