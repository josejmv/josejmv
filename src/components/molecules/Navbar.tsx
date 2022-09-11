// main tools
import Link from 'next/link'

// bootstrap components
import { Nav, Navbar as BsNavbar, Container } from 'react-bootstrap'
import { Github, Linkedin, Instagram } from 'react-bootstrap-icons'

// styles
import classes from 'styles/components/navbar/styles.module.scss'

// types
import { FC } from 'react'

export const Navbar: FC = () => (
  <BsNavbar
    expand='md'
    sticky='top'
    collapseOnSelect
    className={classes.navbar}
  >
    <Container>
      <div className={classes.navbar_header}>
        <BsNavbar.Brand className={classes.logo}>
          <Link href='/'>
            <a>JoseJMV</a>
          </Link>
        </BsNavbar.Brand>
        <BsNavbar.Toggle className={classes.toggle} />
      </div>
      <BsNavbar.Collapse className={classes.collapse}>
        <Nav className={classes.anchors}>
          <Nav.Item className={classes.item}>
            <Link href='/#'>
              <a>About</a>
            </Link>
          </Nav.Item>
          <Nav.Item className={classes.item}>
            <Link href='/#'>
              <a>Skills</a>
            </Link>
          </Nav.Item>
          <Nav.Item className={classes.item}>
            <Link href='/#'>
              <a>Teams</a>
            </Link>
          </Nav.Item>
          <Nav.Item className={classes.item}>
            <Link href='/#'>
              <a>Projects</a>
            </Link>
          </Nav.Item>
          <Nav.Item className={classes.item}>
            <Link href='/#'>
              <a>Contact</a>
            </Link>
          </Nav.Item>
        </Nav>
        <Nav className={classes.rrss}>
          <Nav.Link
            target='_blank'
            className={classes.item}
            href='https://github.com/josejmv'
          >
            <Github size={24} />
          </Nav.Link>
          <Nav.Link
            target='_blank'
            className={classes.item}
            href='https://www.linkedin.com/in/josejmv/'
          >
            <Linkedin size={24} />
          </Nav.Link>
          <Nav.Link
            target='_blank'
            className={classes.item}
            href='https://instagram.com/josemvasquezv'
          >
            <Instagram size={24} />
          </Nav.Link>
        </Nav>
      </BsNavbar.Collapse>
    </Container>
  </BsNavbar>
)
