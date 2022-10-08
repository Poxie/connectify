import '../styles/globals.scss'
import styles from '../styles/Main.module.scss';
import type { AppProps } from 'next/app'
import { AuthProvider } from '../contexts/auth/AuthProvider'
import { Navbar } from '../components/navbar'
import { Sidebar } from '../components/sidebar'
import { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import { wrapper } from '../redux/store'
import { ModalProvider } from '../contexts/modal/ModalProvider'
import { PopoutProvider } from '../contexts/popouts/PopoutProvider';
import { SocketProvider } from '../contexts/socket/SocketProvider';

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
      <SocketProvider>
        <ModalProvider>
          <PopoutProvider>
            <Navbar />
            <div className={styles['app-content']}>
              <Sidebar />
              <main>
                {getLayout(
                  <Component {...pageProps} />
                )}
              </main>
            </div>
          </PopoutProvider>
        </ModalProvider>
      </SocketProvider>
    </AuthProvider>
  )
}
export default wrapper.withRedux(MyApp);
