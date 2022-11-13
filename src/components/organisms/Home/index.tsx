// components
import { rightToLeft } from '@atoms/animations/utils'
import { DivMotion } from '@atoms/animations'
import { ProfileCard } from './profileCard'
import { Projects } from './projects'

// bootstrap components
import { Container, Row, Col } from 'react-bootstrap'

// styles
import classes from 'styles/public/home/styles.module.scss'

// types
import { FC } from 'react'

export const HomePage: FC = () => (
  <Container className={classes.home}>
    <DivMotion {...rightToLeft}>
      <h1 className={classes.title}>Inicio </h1>
    </DivMotion>
    <Row className={classes.container}>
      <Col xs={12} sm={8} xl={5}>
        <ProfileCard />
      </Col>
      <Col xs={12}>
        <DivMotion {...rightToLeft}>
          <h2 className={`mb-5 ${classes.title}`}>Proyectos personales</h2>
        </DivMotion>
        <Projects />
      </Col>
    </Row>
  </Container>
)
