// main tools
import { useRouter } from 'next/router'
import { useState } from 'react'

// next components
import Link from 'next/link'

// bootstrap components
import { Navbar, Container, CloseButton, Nav, Row, Col } from 'react-bootstrap'
import {
  JournalBookmark,
  ChatQuote,
  Brush,
  Twitch
} from 'react-bootstrap-icons'

// styles
import classes from 'styles/public/blog/layouts/navbar.module.scss'

// types
import { FC } from 'react'

export const BlogNavbar: FC = () => {
  const { push } = useRouter()
  const [show, setShow] = useState(false)

  const items = [
    { label: 'Cursos', href: '/blog/courses', icon: JournalBookmark },
    { label: 'Monologos', href: '/blog/monologues', icon: ChatQuote },
    { label: 'Poemas', href: '/blog/pems', icon: Brush },
    { label: 'Directos', href: '/blog/lives', icon: Twitch }
  ]

  const handleShow = () => setShow(!show)
  const handleNav = (href: string) => {
    handleShow()
    push(href)
  }

  return (
    <Navbar collapseOnSelect expand='md' expanded={show}>
      <Container fluid className={classes.navbar}>
        <Navbar.Brand className={classes.navbar_header}>
          <Link passHref href='/'>
            <a className={classes.title}>Portafolio</a>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle onClick={handleShow} className={classes.toggle} />
        <Navbar.Offcanvas placement='bottom'>
          {!show ? (
            <Nav>
              {items.map((item, idx) => (
                <Link passHref key={item.label} href={item.href}>
                  <Nav.Item
                    as='a'
                    className={`${idx === 0 ? 'ms-4' : ''} mx-2`}>
                    {item.label}
                  </Nav.Item>
                </Link>
              ))}
            </Nav>
          ) : (
            <Container fluid className={classes.mobileSidebar}>
              <CloseButton className={classes.close} onClick={handleShow} />
              <Row className={classes.mobileNav}>
                {items.map((Item) => (
                  <Col
                    as='a'
                    xs={5}
                    key={Item.label}
                    className={classes.mobileNav_item}
                    onClick={() => handleNav(Item.href)}>
                    <Item.icon size={22} />
                    <span>{Item.label}</span>
                  </Col>
                ))}
              </Row>
            </Container>
          )}
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}
