// main tools
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'

// components
import { PageLoader } from '@molecules/PageLoader'
import { LoginModal } from '@molecules/LoginModal'

// providers
import { AppContextProvider } from 'context/app/provider'
import { SSRProvider } from 'react-bootstrap'

// dayjs
import { locales } from 'lib/dayjs/locales'
import 'lib/dayjs/plugins'
import dayjs from 'dayjs'

// prime components
import { ScrollTop } from 'primereact/scrolltop'

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
        <meta name='theme-color' content='#0050ac' />
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
          content={`${permalink}/assets/pics/profile.jpg`}
        />
      </Head>

      <SessionProvider session={pageProps.session}>
        <SSRProvider>
          <AppContextProvider>
            <PageLoader>
              <Component {...pageProps} />

              <LoginModal />
              <ScrollTop className='scroll-to-top' />
            </PageLoader>
          </AppContextProvider>
        </SSRProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp
