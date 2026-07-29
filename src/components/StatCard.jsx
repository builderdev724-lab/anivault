import { Play, Clock, PauseCircle, CheckCircle2, XCircle } from 'lucide-react'

const ICONS = {
  Watching: Play,
  Planned: Clock,
  'On-Hold': PauseCircle,
  Watched: CheckCircle2,
  Dropped: XCircle,
}

export default function StatCard({ status, count }) {
  const Icon = ICONS[status] || Play
  return (
    <div className={'stat-card st-' + status}>
      <div className="icon">
        <Icon size={16} strokeWidth={2.4} />
      </div>
      <div className="num">{count}</div>
      <div className="lbl">{status}</div>
    </div>
  )
}
