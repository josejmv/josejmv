// components
import { Footer } from '@molecules/Footer'
import { BlogNavbar } from '@organisms/Blog/Layouts/navbar'

// types
import { FC } from 'react'

type LayoutProps = {
  children?: JSX.Element | JSX.Element[]
}

export const Template: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <BlogNavbar />

      {children}

      <Footer />
    </>
  )
}
