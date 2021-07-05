// next components
import Image from 'next/image'

// bootstrap components
import { Card, Row, Col } from 'react-bootstrap'

// components
import { Layout } from 'components/Layout'
import { NextRight } from 'components/atoms'

// styles
import styles from 'styles/home.module.scss'

// types
import type { FC } from 'react'

const Home: FC = () => {
  const logos = [
    { src: '/logos/nextjs.svg', alt: 'next.js logo' },
    { src: '/logos/nodejs.svg', alt: 'node.js logo' },
    { src: '/logos/symfony.svg', alt: 'symfony logo' },
    { src: '/logos/wordpress.svg', alt: 'wordpress logo' },
  ]

  return (
    <Layout navbarAttributes={{ bg: 'transparent', fixed: 'top' }}>
      <Card className={styles.card}>
        <Card.Img
          className={styles.card_background}
          src='/wallpapers/home.jpg'
          alt='home img'
        />
        <Card.ImgOverlay className={styles.card_overlay}>
          <Card.Body className={styles.card_overlay_body}>
            <Row className='justify-content-center pb-4'>
              <Col sm={12} md={7}>
                <h1 className={styles.card_overlay_body_title}>
                  Hola, mi nombre es Jose Vasquez
                </h1>
                <h2 className={styles.card_overlay_body_subtitle}>
                  Soy desarrollador web
                </h2>
                <p className={styles.card_overlay_body_description}>
                  Me fascinan todos los ambitos de la programacion, backend,
                  frontend, devops, data science y demas, actualmente mi fuerte
                  se basa en frontend pero quiero seguir expandiendo mis
                  conocimientos en las demas areas, especialmente backend y
                  devops que son mis favoritas
                </p>
              </Col>
            </Row>
            <h3 className={styles.card_overlay_body_subtitle}>
              Actualmente mi experiencia se basa en las siguientes herramientas
            </h3>
            <Row className='py-5'>
              {logos.map((logo, idx) => (
                <Col key={idx} xs={3}>
                  <Image
                    className={
                      idx === 0
                        ? styles.card_overlay_body_logo_invert
                        : styles.card_overlay_body_logo
                    }
                    src={logo.src}
                    width={80}
                    height={80}
                    alt={logo.alt}
                    layout='intrinsic'
                  />
                </Col>
              ))}
            </Row>
            <NextRight href='/progress'>
              Echa un vistazo a mi progreso
            </NextRight>
          </Card.Body>
        </Card.ImgOverlay>
      </Card>
    </Layout>
  )
}

export default Home
