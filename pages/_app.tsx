// main tools
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Head from 'next/head'

// components
import { PageLoader } from '@molecules/PageLoader'

// context
import { AppContextProvider } from 'context/app/provider'

// dayjs
import { locales } from 'lib/dayjs/locales'
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
import { NextPage } from 'next'

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  const { locale } = useRouter()
  dayjs.locale(locales[locale as keyof typeof locales])

  return (
    <>
      <Head>
        <title>JoseJMV</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='Portafolio' />
      </Head>

      <AppContextProvider>
        <PageLoader>
          <Component {...pageProps} />
          <ScrollTop />
        </PageLoader>
      </AppContextProvider>
    </>
  )
}

export default MyApp
