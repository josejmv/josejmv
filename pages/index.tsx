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

const Home: FC = () => (
  <Layout navbarAttributes={{ bg: 'transparent', fixed: 'top' }}>
    <Card className={styles.card}>
      <Card.Img
        className={styles.card_background}
        src='/wallpapers/home.jpg'
        width='100vw'
        alt='home img'
      />
      <Card.ImgOverlay className={styles.card_overlay}>
        <Row className='justify-content-center'>
          <Col className='mb-lg-5' sm={12} md={10} lg={8}>
            <h1 className={styles.card_overlay_title}>
              Hola, mi nombre es Jose Vasquez
            </h1>
            <h2 className={styles.card_overlay_subtitle}>
              Soy desarrollador web
            </h2>
            <p className={styles.card_overlay_description}>
              Me fascinan todos los ambitos de la programacion, backend,
              frontend, devops, data science y demas, actualmente mi fuerte se
              basa en frontend pero quiero seguir expandiendo mis conocimientos
              en las demas areas, especialmente backend y devops que son mis
              favoritas
            </p>
          </Col>
          <Col className='mb-lg-5 mb-md-2' md={12}>
            <h3 className={styles.card_overlay_subtitle}>
              Actualmente mi experiencia se basa en las siguientes herramientas
            </h3>
            <Row className='mt-5'>
              <Col xs={3}>
                <Image
                  className={styles.card_overlay_logo_invert}
                  src='/logos/nextjs.svg'
                  width={80}
                  height={80}
                  alt='next.js logo'
                />
              </Col>
              <Col xs={3}>
                <Image
                  className={styles.card_overlay_logo}
                  src='/logos/nodejs.svg'
                  width={80}
                  height={80}
                  alt='node.js logo'
                />
              </Col>
              <Col xs={3}>
                <Image
                  className={styles.card_overlay_logo}
                  src='/logos/symfony.svg'
                  width={80}
                  height={80}
                  alt='symfony logo'
                />
              </Col>
              <Col xs={3}>
                <Image
                  className={styles.card_overlay_logo}
                  src='/logos/wordpress.svg'
                  width={80}
                  height={80}
                  alt='wordpress logo'
                />
              </Col>
            </Row>
          </Col>
          <Col md={12}>
            <NextRight href='/progress'>
              Echa un vistazo a mi progreso
            </NextRight>
          </Col>
        </Row>
      </Card.ImgOverlay>
    </Card>
  </Layout>
)

export default Home
