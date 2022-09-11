// main tools
import { useState, useEffect } from 'react'
import Head from 'next/head'

// components
import { Layout } from 'components/molecules/Layout'

// bootstrap components
import { Spinner } from 'react-bootstrap'

// prime components
import { BlockUI } from 'primereact/blockui'
import { ScrollTop } from 'primereact/scrolltop'

// styles
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'styles/globals.scss'

// types
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { NextPage } from 'next'

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  const [loadingPage, setLoadingPage] = useState(false)
  const { events } = useRouter()

  /**
   * Navbar animation controller on scroll and Page transition loader
   */
  useEffect(() => {
    events.on('routeChangeStart', () => setLoadingPage(true))
    events.on('routeChangeComplete', () => setLoadingPage(false))

    return () => {
      events.off('routeChangeComplete', () => setLoadingPage(false))
    }
  }, [events])

  return (
    <>
      <Head>
        <title>JoseJMV</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='Portafolio' />
      </Head>

      <Layout>
        <Component {...pageProps} />
        <BlockUI
          fullScreen
          blocked={loadingPage}
          template={<Spinner animation='grow' />}
        />
        <ScrollTop />
      </Layout>
    </>
  )
}

export default MyApp
