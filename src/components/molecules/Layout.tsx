// components
import { Navbar } from '@molecules/Navbar'
import { Footer } from '@molecules/Footer'

// types
import { FC } from 'react'

type LayoutProps = {
  children: JSX.Element[]
}

export const Layout: FC<LayoutProps> = (props) => (
  <>
    <Navbar />

    <div>{props.children}</div>

    <Footer />
  </>
)
