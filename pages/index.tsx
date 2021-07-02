// next components
import Image from 'next/image'
import Link from 'next/link'

// bootstrap components
import { Card, Row, Col, Button } from 'react-bootstrap'
import { ChevronDoubleRight } from 'react-bootstrap-icons'

// components
import { Layout } from 'components/Layout'

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
          <Col className='mb-5' md={6}>
            <h1>Hola, mi nombre es Jose Vasquez</h1>
            <h2>Soy desarrollador web</h2>
            <p>
              Me fascinan todos los ambitos de la programacion, backend,
              frontend, devops, data science y demas, actualmente mi fuerte se
              basa en frontend pero quiero seguir expandiendo mis conocimientos
              en las demas areas, especialmente backend y devops que son mis
              favoritas
            </p>
          </Col>
          <Col className='mb-5' md={12}>
            <h3>
              Actualmente mi experiencia se basa en las siguientes herramientas
            </h3>
            <Row className='mt-5'>
              <Col md={3}>
                <Image
                  className={styles.card_overlay_logo_invert}
                  src='/logos/nextjs.svg'
                  width={80}
                  height={80}
                  alt='next.js logo'
                />
              </Col>
              <Col md={3}>
                <Image
                  className={styles.card_overlay_logo}
                  src='/logos/nodejs.svg'
                  width={80}
                  height={80}
                  alt='node.js logo'
                />
              </Col>
              <Col md={3}>
                <Image
                  className={styles.card_overlay_logo}
                  src='/logos/symfony.svg'
                  width={80}
                  height={80}
                  alt='symfony logo'
                />
              </Col>
              <Col md={3}>
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
            <Link passHref href='#'>
              <Button
                as='a'
                className={styles.card_overlay_next}
                variant='outline-light'
                size='lg'
              >
                Echa un vistazo a mis proyectos realizados{' '}
                <ChevronDoubleRight className={styles.card_overlay_next_icon} />
              </Button>
            </Link>
          </Col>
        </Row>
      </Card.ImgOverlay>
    </Card>
  </Layout>
)

export default Home
