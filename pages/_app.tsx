// main tools
import Head from 'next/head'

// components
import { PageLoader } from '@molecules/PageLoader'

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

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>JoseJMV</title>
      <link rel='icon' href='/favicon.ico' />
      <meta name='description' content='Portafolio' />
    </Head>

    <PageLoader>
      <Component {...pageProps} />
      <ScrollTop />
    </PageLoader>
  </>
)

export default MyApp
