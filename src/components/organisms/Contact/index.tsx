// main tools
import Link from 'next/link'

// bootstrap components
import { Container, Row, Col } from 'react-bootstrap'
import {
  Github,
  Linkedin,
  Whatsapp,
  Instagram,
  EnvelopeFill,
} from 'react-bootstrap-icons'

// styles
import classes from 'styles/public/contact/styles.module.scss'

// types
import { FC } from 'react'

export const ContactPage: FC = () => {
  const email = 'josejmvasquez@gmail.com'
  const githubUrl = 'https://github.com/josejmv'
  const linkedinUrl = 'https://www.linkedin.com/in/josejmv/'
  const instagramUrl = 'https://www.instagram.com/josemvasquezv/'
  const whatsappUrl =
    'https://api.whatsapp.com/send/?phone=%2B584147545160&text=Hola,%20Jose%20Manuel%20mucho%20gusto.&type=phone_number&app_absent=0'

  const items = [
    {
      icon: Whatsapp,
      label: 'Whatsapp',
      href: whatsappUrl,
    },
    {
      icon: EnvelopeFill,
      href: `mailto:${email}`,
      label: 'Correo electrónico',
    },
    {
      icon: Linkedin,
      label: '@josejmv',
      href: linkedinUrl,
    },
  ]

  const rrss = [
    {
      icon: Instagram,
      href: instagramUrl,
      label: '@josemvasquezv',
    },
    {
      icon: Github,
      href: githubUrl,
      label: '@josejmv',
    },
  ]

  return (
    <Container className={classes.contact}>
      <h1 className={classes.title}>Contáctame</h1>

      <h2 className={classes.subtitle}>Tienes alguna pregunta?</h2>
      <p className={classes.small}>
        Contactame por medio de las siguientes opciones
      </p>
      <Row className='my-5 justify-content-center'>
        {items.map((Item) => (
          <Col key={Item.label} className={classes.item} xs={12} sm={6} lg={4}>
            <Link href={Item.href}>
              <a target='_blank'>
                <div>
                  <Item.icon className={classes.icon} size={30} />
                  <p>{Item.label}</p>
                </div>
              </a>
            </Link>
          </Col>
        ))}
      </Row>
      <h2 className={classes.subtitle}>Quieres conocerme más?</h2>
      <p className={classes.small}>Sigueme en mis redes sociales</p>
      <Row className='my-5 justify-content-center'>
        {rrss.map((Item) => (
          <Col key={Item.label} className={classes.item} xs={6} lg={4}>
            <Link href={Item.href}>
              <a target='_blank'>
                <div>
                  <Item.icon className={classes.icon} size={30} />
                  <p>{Item.label}</p>
                </div>
              </a>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
