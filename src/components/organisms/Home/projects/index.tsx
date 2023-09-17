// main tools
import Link from 'next/link'

// components
import { Card } from '@molecules/card'

// utils
import { personalProjects } from './utils'

// bootstrap components
import { Container, Row, Col } from 'react-bootstrap'

// styles
import classes from 'styles/public/home/projects.module.scss'

// types
import { FC } from 'react'

export const Projects: FC = () => (
  <Container as='section' className={classes.projects}>
    <Row>
      {personalProjects.map((project) => (
        <Col sm={6} lg={4} xl={3} key={project.name}>
          <Link target='_blank' passHref href={project.url}>
            <Card {...project} />
          </Link>
        </Col>
      ))}
    </Row>
  </Container>
)
