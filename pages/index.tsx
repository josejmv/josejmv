// components
import * as VIEWS from '@organisms/index'
import { Sidebar } from '@molecules/Sidebar'
import { Navbar } from '@molecules/Navbar'
import { Footer } from '@molecules/Footer'

// bootstrap components
import { Container, Row, Col, Tab } from 'react-bootstrap'

// styles
import classes from 'styles/public/styles.module.scss'

// types
import type { NextPage } from 'next'

const Home: NextPage = () => {
  const contents = [
    { component: VIEWS.HomePage, eventKey: 'home' },
    { component: VIEWS.BlogPage, eventKey: 'blog' },
    { component: VIEWS.AboutPage, eventKey: 'about' },
    { component: VIEWS.Experience, eventKey: 'experience' },
    { component: VIEWS.ContactPage, eventKey: 'contact' },
  ]

  return (
    <>
      <Tab.Container id='tab-content' defaultActiveKey='home'>
        <Container fluid className={classes.container}>
          <Row className={classes.content}>
            <Navbar />
            <Col className={classes.aside} md={3} xl={2}>
              <Sidebar />
            </Col>

            <Col className={classes.main} md={9} xl={10}>
              <Tab.Content>
                {contents.map((Content, idx) => (
                  <Tab.Pane
                    key={idx}
                    className='my-5'
                    eventKey={Content.eventKey}
                  >
                    <Content.component />
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
          </Row>
        </Container>
      </Tab.Container>
      <Footer />
    </>
  )
}

export default Home
