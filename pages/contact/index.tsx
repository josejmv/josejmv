// bootstrap components
import { Container, Row, Col } from 'react-bootstrap'

// components
import { Layout } from 'components/Layout'
import * as PAGE from 'components/pages/contact'

// types
import type { FC } from 'react'

// styles
import styles from 'styles/pages/contact.module.scss'

const Contact: FC = () => (
  <Layout title='Contact'>
    <Container className='pt-5'>
      <h1 className='text-center mb-5'>Contacto</h1>
      <Row>
        <Col className={'pt-5'} md={6}>
          <PAGE.Rrss />
        </Col>
        <Col className={styles.form} md={6}>
          <PAGE.ContactForm />
        </Col>
      </Row>
    </Container>
  </Layout>
)

export default Contact
