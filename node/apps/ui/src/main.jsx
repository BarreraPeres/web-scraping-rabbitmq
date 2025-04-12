import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider as HooksProvider } from './hooks'
import { RouterProvider } from 'react-router-dom'
import Router from './router'


createRoot(document.getElementById('root')).render(
  <HooksProvider>
    <RouterProvider router={Router} />
  </HooksProvider>
)
