import '../styles/globals.scss'
import styles from '../styles/Main.module.scss';
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next';
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
import { TooltipProvider } from '../contexts/tooltip/TooltipProvider';
import { ToastProvider } from '../contexts/toast/ToastProvider';
import { Provider } from 'react-redux';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps, ...rest }: AppPropsWithLayout) {
  // Redux store
  const { store } = wrapper.useWrappedStore(rest);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return(
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <SocketProvider>
              <TooltipProvider>
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
              </TooltipProvider>
            </SocketProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  )
}
export default appWithTranslation(MyApp);
