// main tools
import { useRouter } from 'next/router'
import Head from 'next/head'

// components
import { PageLoader } from '@molecules/PageLoader'

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
import { NextPage } from 'next'

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  const { locale } = useRouter()
  const permalink = 'https://josejmv.vercel.app'
  dayjs.locale(locales[locale as keyof typeof locales])

  return (
    <>
      <Head>
        <title>JoseJMV</title>
        <link rel='canonical' href={permalink} />
        <meta property='og:type' content='website' />
        <meta name='robots' content='index follow' />
        <meta property='og:url' content={permalink} />
        <meta name='description' content='Portafolio' />
        <meta property='og:description' content='Portafolio' />
        <meta property='og:title' content='JoseJMV - portafolio' />
        <meta
          property='og:image'
          content={`${permalink}/assets/img/profile.jpg`}
        />
      </Head>

      <SSRProvider>
        <AppContextProvider>
          <PageLoader>
            <Component {...pageProps} />
            <ScrollTop className='scroll-to-top' />
          </PageLoader>
        </AppContextProvider>
      </SSRProvider>
    </>
  )
}

export default MyApp
