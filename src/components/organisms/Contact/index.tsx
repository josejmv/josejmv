// main tools
import Link from 'next/link'

// bootstrap components
import { Container, Row, Col } from 'react-bootstrap'

// utils
import { items, rrss } from './utils'

// styles
import classes from 'styles/public/contact/styles.module.scss'

// types
import { FC } from 'react'

export const ContactPage: FC = () => {
  return (
    <Container className={classes.contact}>
      <h1 className={classes.title}>Contáctame</h1>

      <h2 className={classes.subtitle}>Tienes alguna pregunta?</h2>
      <p className={classes.small}>
        Contactame por medio de las siguientes opciones
      </p>
      <Row className='my-5 justify-content-center'>
        {items.map((Item) => (
          <Col key={Item.label} className={classes.item} xs={6} lg={4}>
            <Link target='_blank' href={Item.href}>
              <div>
                <Item.icon className={classes.icon} size={30} />
                <p>{Item.label}</p>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
      <h2 className={classes.subtitle}>Quieres conocerme más?</h2>
      <p className={classes.small}>Sigueme en mis redes sociales</p>
      <Row className='my-5 justify-content-center'>
        {rrss.map((Item) => (
          <Col key={Item.label} className={classes.item} xs={6} lg={4}>
            <Link target='_blank' href={Item.href}>
              <div>
                <Item.icon className={classes.icon} size={30} />
                <p>{Item.label}</p>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
