// prime components
import { Divider } from 'primereact/divider'

// bootstrap components
import {
  Chat,
  House,
  Person,
  Github,
  Linkedin,
  Download,
  Newspaper,
  Instagram,
  ArrowRight,
  GraphUpArrow
} from 'react-bootstrap-icons'
import { Container, Row, Col, Button, Nav } from 'react-bootstrap'

// hooks
import { useApp } from 'hooks/useApp'

// styles
import classes from 'styles/components/sidebar/styles.module.scss'

// types
import { FC } from 'react'
import { DivMotion } from '@atoms/animations'
import { animations } from './utils'

type SidebarProps = {
  handleShowSidebar?: () => void
}

export const Sidebar: FC<SidebarProps> = ({ handleShowSidebar }) => {
  const { toast } = useApp()
  const anchors = [
    { label: 'Inicio', eventKey: 'home', icon: House },
    // { label: 'Blog', eventKey: 'blog', icon: Newspaper },
    { label: 'Sobre mí', eventKey: 'about', icon: Person },
    { label: 'Experiencia', eventKey: 'experience', icon: GraphUpArrow },
    { label: 'Contacto', eventKey: 'contact', icon: Chat }
  ]

  /**
   * handle show toast on downloaded file
   */
  const handleDownloadFile = () =>
    toast()?.show({
      summary: 'Éxito!',
      severity: 'success',
      detail: 'Árchivo descargado con éxito'
    })

  return (
    <aside className={classes.aside}>
      <h2 className={classes.title}>Portafolio</h2>
      <Divider layout='horizontal' className={classes.divider} />

      <Container>
        <Row>
          {anchors.map((Anchor, idx) => (
            <Col className={classes.item} key={idx} xs={12}>
              <DivMotion {...animations.anchors(idx)}>
                <Nav.Item>
                  <Nav.Link
                    eventKey={Anchor.eventKey}
                    onClick={handleShowSidebar}>
                    <Button className={classes.outline}>
                      <span>
                        <Anchor.icon size={20} className='me-2' />{' '}
                        {Anchor.label}
                      </span>
                      <ArrowRight size={25} />
                    </Button>
                  </Nav.Link>
                </Nav.Item>
              </DivMotion>
            </Col>
          ))}
        </Row>
        <DivMotion {...animations.actions}>
          <a download href='/assets/cv/Jose_Vasquez.pdf'>
            <Button onClick={handleDownloadFile} className={classes.download}>
              <Download size={23} className='me-3' /> Descargar CV
            </Button>
          </a>
          <Nav className={classes.rrss}>
            <Nav.Link
              target='_blank'
              className={classes.item}
              href='https://github.com/josejmv'>
              <Github size={24} />
            </Nav.Link>
            <Nav.Link
              target='_blank'
              className={classes.item}
              href='https://www.linkedin.com/in/josejmv/'>
              <Linkedin size={24} />
            </Nav.Link>
            <Nav.Link
              target='_blank'
              className={classes.item}
              href='https://instagram.com/josemvasquezv'>
              <Instagram size={24} />
            </Nav.Link>
          </Nav>
        </DivMotion>
      </Container>
    </aside>
  )
}
