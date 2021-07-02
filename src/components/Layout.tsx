// next components
import Head from 'next/head'

// components
import { Navbar } from 'components/Navbar'

// types
import type { NavbarType } from 'types'
import type { FC } from 'react'

export const Layout: FC<NavbarType> = ({
  title,
  navbarAttributes = { bg: 'dark', sticky: 'top' },
  children,
}) => (
  <>
    <Head>
      <title>JoseJMV {title && `| ${title}`}</title>
    </Head>

    <Navbar attributes={navbarAttributes} />
    <main>{children}</main>
  </>
)
