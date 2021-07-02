// next tools
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// components
import { PageLoader } from 'components/PageLoader'

// styles
import 'styles/globals.scss'

// types
import type { FC } from 'react'
import type { AppProps } from 'next/app'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const [loadingPage, setLoadingPage] = useState(false)
  const router = useRouter()

  /**
   * Page transition loader
   */
  useEffect(() => {
    router.events.on('routeChangeStart', () => setLoadingPage(true))
    router.events.on('routeChangeComplete', () => setLoadingPage(false))

    /**
     * Cleaning events for unmounting component
     */
    return () =>
      router.events.off('routeChangeComplete', () => setLoadingPage(false))
  }, [])

  return (
    <>
      <PageLoader show={loadingPage} setShow={setLoadingPage} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
