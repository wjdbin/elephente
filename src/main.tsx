import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ScheduleProvider } from './schedule/ScheduleContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScheduleProvider>
        <App />
      </ScheduleProvider>
    </BrowserRouter>
  </StrictMode>,
)
