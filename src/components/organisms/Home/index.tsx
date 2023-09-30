// components
import { DivMotion } from '@atoms/animations'
import { ProfileCard } from './profile-card'
import { Projects } from './projects'

// utils
import { topToBottom } from '@atoms/animations/utils'

// bootstrap components
import { Container, Row, Col } from 'react-bootstrap'

// styles
import classes from 'styles/pages/home/styles.module.scss'

// types
import { FC } from 'react'

export const HomePage: FC = () => (
  <Container className={classes.home}>
    <DivMotion {...topToBottom}>
      <h1 className={classes.title}>Inicio </h1>
    </DivMotion>
    <Row className={classes.container}>
      <Col xs={12} sm={8} xl={5}>
        <ProfileCard />
      </Col>
      <Col xs={12}>
        <DivMotion {...topToBottom}>
          <h2 className={`mb-5 ${classes.title}`}>Proyectos personales</h2>
        </DivMotion>
        <Projects />
      </Col>
    </Row>
  </Container>
)
