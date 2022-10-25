// main tools
import dayjs from 'dayjs'

// bootstrap components
import { Container, Row, Col, ListGroup } from 'react-bootstrap'

// hooks
import { useApp } from 'hooks/useApp'

// styles
import classes from 'styles/public/about/styles.module.scss'

// types
import { FC } from 'react'

export const AboutPage: FC = () => {
  const { toast } = useApp()
  const birthdate = dayjs('04/30/1999')

  const handleCopyEmail = () => {
    navigator.clipboard
      .writeText('josejmvasquez@gmail.com')
      .then(() =>
        toast()?.show({
          summary: 'Éxito!',
          severity: 'success',
          detail: 'Correo copiado éxitosamente',
        })
      )
      .catch(() =>
        toast()?.show({
          summary: 'Error',
          severity: 'error',
          detail: 'Error copiando el correo',
        })
      )
  }

  return (
    <Container className={classes.about}>
      <h1 className={classes.title}>Sobre mí</h1>

      <h2 className={classes.subtitle}>
        Hola! mi nombre es{' '}
        <span className={classes.name}>Jose Manuel Vasquez Vargas 😀</span>
      </h2>
      <p className={classes.small}>
        Soy un apacionado por la ciencia y el arte, me gusta aprender muchas
        cosas nuevas y enfrentar nuevos desafios que lleven al limite mis
        conocimientos. Me gustan bastante las matematicas y la fisica y quiero
        profundizar mas en mis estudios de fisica para, en conjunto con la
        informatica poder avanzar por un campo de inteligencia artificial que
        impulse la ciencia a niveles nunca antes vistos
      </p>
      <p className={classes.small}>
        Actualmente me desempeño como desarrollador web, especializado en el
        area de frontend, trabajando con herramientas como Next.js y React.js
        principalmente, ademas cuento con una amplia gama de conocimientos en
        herramientas que me permiten desarrollar proyectos de alta calidad con
        muy buenos niveles de seguridad y calidad
      </p>

      <Row>
        <Col lg={6}>
          <Row>
            <Col lg={6}>
              <ListGroup className={classes.list}>
                <ListGroup.Item className={classes.item}>
                  <strong>Fecha de nacimiento:</strong>{' '}
                  <p>{birthdate.format('DD, MMMM [de] YYYY')}</p>
                </ListGroup.Item>
                <ListGroup.Item className={classes.item}>
                  <strong>Título:</strong> <p>Bachiller</p>
                </ListGroup.Item>
                <ListGroup.Item className={classes.item}>
                  <strong>Residencia:</strong> <p>Venezuela, San Cristóbal</p>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col lg={6}>
              <ListGroup className={classes.list}>
                <ListGroup.Item className={classes.item}>
                  <strong>Edad:</strong>{' '}
                  <p>{dayjs().diff(birthdate, 'y')} Años</p>
                </ListGroup.Item>
                <ListGroup.Item
                  role='button'
                  className={classes.item}
                  onClick={handleCopyEmail}
                >
                  <strong>Correo:</strong> <p>josejmvasquez@gmail.com</p>
                </ListGroup.Item>
                <ListGroup.Item className={classes.item}>
                  <strong>Cargo:</strong> <p>Desarrollador frontend</p>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Col>
        <Col lg={6}></Col>
      </Row>
    </Container>
  )
}
