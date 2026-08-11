import { Toaster } from 'react-hot-toast'
import { AdminProvider } from './admin/AdminContext'
import { useRevelar } from './lib/useRevelar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Carta from './components/Carta'
import Footer from './components/Footer'
import BotonArriba from './components/BotonArriba'

export default function App() {
  useRevelar()

  return (
    <AdminProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#12100f',
            color: '#f6eae0',
            border: '1px solid rgba(206,134,116,0.35)',
            fontFamily: 'Lora, Georgia, serif',
            borderRadius: '14px',
            padding: '12px 16px',
            boxShadow: '0 24px 50px -24px rgba(0,0,0,0.8)',
          },
        }}
      />
      <div className="relative flex min-h-svh flex-col">
        <Navbar />
        <Hero />
        <Carta />
        <Footer />
        <BotonArriba />
      </div>
    </AdminProvider>
  )
}
