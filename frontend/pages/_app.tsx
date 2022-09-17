import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../contexts/auth/AuthProvider'
import { Navbar } from '../components/navbar'
import { Sidebar } from '../components/sidebar'
import { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import { wrapper } from '../redux/store'
import { ModalProvider } from '../contexts/modal/ModalProvider'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return(
    <AuthProvider>
      <ModalProvider>
        <Navbar />
        <div style={{
          display: 'flex',
          width: 'var(--width-main)',
          maxWidth: 'var(--width-max)',
          margin: '0 auto'
        }}>
          <Sidebar />
          <main style={{
            flex: 1,
            paddingLeft: 'var(--spacing-primary)',
            paddingTop: 'var(--spacing-primary)'
          }}>
            {getLayout(
              <Component {...pageProps} />
            )}
          </main>
        </div>
      </ModalProvider>
    </AuthProvider>
  )
}
export default wrapper.withRedux(MyApp);
