// components
import { ProfileCard } from './profileCard'
import { Projects } from './projects'

// bootstrap components
import { Container, Row, Col } from 'react-bootstrap'

// styles
import classes from 'styles/public/home/styles.module.scss'

// types
import { FC } from 'react'

export const HomePage: FC = () => {
  return (
    <Container className={classes.home}>
      <h1 className={classes.title}>Inicio</h1>
      <Row className={classes.container}>
        <Col xs={12} sm={8} xl={5}>
          <ProfileCard />
        </Col>
        <Col xs={12}>
          <Projects />
        </Col>
      </Row>
    </Container>
  )
}
