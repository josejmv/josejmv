// main tools
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'

// components
import { LoginModal } from '@molecules/login-modal'
import { PageLoader } from '@molecules/page-loader'

// providers
import { AppContextProvider } from 'context/app/provider'
import { SSRProvider } from 'react-bootstrap'

// dayjs
import { locales } from 'lib/dayjs/locales'
import 'lib/dayjs/plugins'
import dayjs from 'dayjs'

// styles
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'styles/globals.scss'

// types
import type { AppProps } from 'next/app'
import { Session } from 'next-auth'
import { NextPage } from 'next'

type MyAppProps = {
  session: Session
}

const MyApp: NextPage<AppProps<MyAppProps>> = ({ Component, pageProps }) => {
  const { locale } = useRouter()
  const permalink = 'https://josejmv.vercel.app'
  dayjs.locale(locales[locale as keyof typeof locales])

  return (
    <>
      <Head>
        <title>JoseJMV</title>
        <link rel='canonical' href={permalink} />
        <meta name='theme-color' content='#d59938' />
        <link rel='manifest' href='/manifest.json' />
        <meta property='og:type' content='website' />
        <meta name='robots' content='index follow' />
        <meta property='og:url' content={permalink} />
        <meta name='description' content='Portafolio' />
        <link rel='apple-touch-icon' href='/icon.png' />
        <meta property='og:description' content='Portafolio' />
        <meta property='og:title' content='JoseJMV - portafolio' />
        <meta
          property='og:image'
          content={`${permalink}/assets/logox/icon-256x256.png`}
        />
      </Head>

      <SessionProvider session={pageProps.session}>
        <SSRProvider>
          <AppContextProvider>
            <PageLoader>
              <Component {...pageProps} />

              <LoginModal />
            </PageLoader>
          </AppContextProvider>
        </SSRProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp
