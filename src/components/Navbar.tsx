// next components
import Link from 'next/link'

// bootstrap components
import { Navbar as BNavbar, Nav } from 'react-bootstrap'

// types
import type { navbarAttributesType } from 'types'
import type { FC } from 'react'

export const Navbar: FC<{ attributes: navbarAttributesType }> = ({
  attributes,
}) => (
  <BNavbar
    collapseOnSelect
    expand='sm'
    variant='dark'
    className='px-5 py-3'
    {...attributes}
  >
    <Link passHref href='/'>
      <BNavbar.Brand>JoseJMV</BNavbar.Brand>
    </Link>
    <BNavbar.Toggle aria-controls='responsive-navbar-nav' />
    <BNavbar.Collapse id='responsive-navbar-nav'>
      <Nav>
        <Link passHref href='#'>
          <Nav.Link>Sobre mi</Nav.Link>
        </Link>
        <Link passHref href='/contact'>
          <Nav.Link>Contacto</Nav.Link>
        </Link>
      </Nav>
    </BNavbar.Collapse>
  </BNavbar>
)
