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
import { MenuProvider } from '../contexts/menu/MenuProvider';
import { ThemeProvider } from '../contexts/theme/ThemeProvider';

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
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <ModalProvider>
            <MenuProvider>
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
            </MenuProvider>
          </ModalProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
export default wrapper.withRedux(MyApp);
