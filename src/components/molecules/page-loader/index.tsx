// main tools
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// prime components
import { BlockUI } from 'primereact/blockui'

// bootstrap components
import { Spinner } from 'react-bootstrap'

// types
import { FC } from 'react'

type PageLoaderProps = {
  children: JSX.Element | JSX.Element[]
}

export const PageLoader: FC<PageLoaderProps> = ({ children }) => {
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
      {children}
      <BlockUI
        fullScreen
        blocked={loadingPage}
        template={<Spinner animation='grow' />}
      />
    </>
  )
}
