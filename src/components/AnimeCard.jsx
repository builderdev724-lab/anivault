import { X, Check } from 'lucide-react'
import { ALL_STATUS } from '../utils/parseHTML'

export default function AnimeCard({
  entry,
  onTitleChange,
  onStatusChange,
  onDelete,
  selectMode,
  selected,
  onToggleSelect,
}) {
  return (
    <div className={'entry-card st-' + entry.status + (selected ? ' selected' : '')}>
      {selectMode && (
        <div
          className={'checkbox' + (selected ? ' checked' : '')}
          onClick={onToggleSelect}
          role="checkbox"
          aria-checked={selected}
        >
          {selected && <Check size={13} strokeWidth={3} />}
        </div>
      )}
      <input
        type="text"
        value={entry.title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Title"
      />
      <select value={entry.status} onChange={(e) => onStatusChange(e.target.value)}>
        {ALL_STATUS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {!selectMode && (
        <button className="del-btn" onClick={onDelete} aria-label="Remove">
          <X size={16} strokeWidth={2.2} />
        </button>
      )}
    </div>
  )
}
