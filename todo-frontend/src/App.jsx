import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Todos from './pages/todos/Todos'
import NotFound from './pages/not-found/NotFound'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Todos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
