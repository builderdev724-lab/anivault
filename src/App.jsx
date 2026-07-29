import { Routes, Route } from 'react-router-dom'
import Splash from './components/Splash'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import ListPage from './pages/ListPage'
import { useAnimeList } from './hooks/useAnimeList'

export default function App() {
  const list = useAnimeList()

  return (
    <div className="app-shell">
      <Splash />
      <Routes>
        <Route path="/" element={<Home list={list} />} />
        <Route path="/list" element={<ListPage list={list} />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
