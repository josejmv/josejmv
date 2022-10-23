// components
import { Sidebar } from '@molecules/Sidebar'
import { Navbar } from '@molecules/Navbar'
import { Footer } from '@molecules/Footer'
import { HomePage } from '@organisms/Home'

// bootstrap components
import { Container, Row, Col, Tab } from 'react-bootstrap'

// styles
import classes from 'styles/public/styles.module.scss'

// types
import type { NextPage } from 'next'

const Home: NextPage = () => {
  const contents = [
    { component: HomePage, eventKey: 'home' },
    { component: () => <>ABOUT</>, eventKey: 'about' },
    { component: () => <>SKILLS</>, eventKey: 'skills' },
    { component: () => <>CONTACT</>, eventKey: 'contact' },
  ]

  return (
    <>
      <Tab.Container defaultActiveKey='home'>
        <Container fluid className={classes.container}>
          <Row className={classes.content}>
            <Navbar />
            <Col className={classes.aside} md={3} xl={2}>
              <Sidebar />
            </Col>

            <Col className={classes.main} md={9} xl={10}>
              <Tab.Content>
                {contents.map((Content, idx) => (
                  <Tab.Pane key={idx} eventKey={Content.eventKey}>
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
