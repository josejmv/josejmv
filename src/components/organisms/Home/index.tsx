// components
import { ProfileCard } from './profileCard'

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

      <Row className={classes.profile}>
        <Col lg={4}>
          <ProfileCard />
        </Col>
      </Row>
    </Container>
  )
}
