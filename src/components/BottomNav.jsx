import { NavLink } from 'react-router-dom'
import { Home, ListChecks } from 'lucide-react'

export default function BottomNav() {
  return (
    <div className="bottomnav">
      <NavLink to="/" end className={({ isActive }) => 'nav-btn' + (isActive ? ' active' : '')}>
        {({ isActive }) => (
          <>
            <span className="ic-wrap">
              <Home size={18} strokeWidth={isActive ? 2.4 : 2} />
            </span>
            Home
          </>
        )}
      </NavLink>
      <NavLink to="/list" className={({ isActive }) => 'nav-btn' + (isActive ? ' active' : '')}>
        {({ isActive }) => (
          <>
            <span className="ic-wrap">
              <ListChecks size={18} strokeWidth={isActive ? 2.4 : 2} />
            </span>
            My List
          </>
        )}
      </NavLink>
    </div>
  )
}
