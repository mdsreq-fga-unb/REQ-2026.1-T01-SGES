import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { QueryProvider } from './app/providers/QueryProvider'
import { ThemeProvider } from './app/providers/ThemeProvider'
import { AuthProvider } from './app/providers/AuthProvider'
import { ToastProvider } from './shared/components/Toast'
import './index.css'

// Inicializa mocks em ambiente de desenvolvimento
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { setupMockApi } = await import('./mocks/handlers')
    setupMockApi()
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryProvider>
    </React.StrictMode>,
  )
})
