import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initFidelity } from './lib/fidelity'
import { FidelityAffordance } from './components/FidelityAffordance'

// Reflect persisted / URL fidelity onto <html> before first paint.
initFidelity()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <FidelityAffordance />
  </StrictMode>,
)
