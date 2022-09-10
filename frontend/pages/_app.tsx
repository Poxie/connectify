import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../contexts/auth/AuthProvider'
import { Navbar } from '../components/navbar'
import { Sidebar } from '../components/sidebar'

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <AuthProvider>
      <Navbar />
      <div style={{
        display: 'flex',
        width: 'var(--width-main)',
        maxWidth: 'var(--width-max)',
        margin: '0 auto'
      }}>
        <Sidebar />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  )
}
export default MyApp
