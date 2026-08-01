import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/routes'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="loading">Loading Kray Music…</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
)
