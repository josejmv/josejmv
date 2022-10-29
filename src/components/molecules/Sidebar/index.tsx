// prime components
import { Divider } from 'primereact/divider'

// bootstrap components
import { Container, Row, Col, Button, Nav } from 'react-bootstrap'
import {
  Chat,
  House,
  Person,
  Github,
  Linkedin,
  GraphUpArrow,
  Instagram,
  ArrowRight,
} from 'react-bootstrap-icons'

// styles
import classes from 'styles/components/sidebar/styles.module.scss'

// types
import { FC } from 'react'

type SidebarProps = {
  handleShowSidebar?: () => void
}

export const Sidebar: FC<SidebarProps> = ({ handleShowSidebar }) => {
  const anchors = [
    { label: 'Inicio', eventKey: 'home', icon: House },
    { label: 'Sobre mí', eventKey: 'about', icon: Person },
    { label: 'Experiencia', eventKey: 'experience', icon: GraphUpArrow },
    { label: 'Contacto', eventKey: 'contact', icon: Chat },
  ]

  return (
    <aside className={classes.aside}>
      <h2 className={classes.title}>Portfolio</h2>
      <Divider layout='horizontal' className={classes.divider} />

      <Container>
        <Row>
          {anchors.map((Anchor, idx) => (
            <Col className={classes.item} key={idx} xs={12}>
              <Nav.Item>
                <Nav.Link
                  eventKey={Anchor.eventKey}
                  onClick={handleShowSidebar}
                >
                  <Button className={classes.outline}>
                    <span>
                      <Anchor.icon size={20} className='me-2' /> {Anchor.label}
                    </span>
                    <ArrowRight size={25} />
                  </Button>
                </Nav.Link>
              </Nav.Item>
            </Col>
          ))}
        </Row>
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
      </Container>
    </aside>
  )
}
