// main tools
import Link from 'next/link'

// bootstrap components
import { Container, Row, Col } from 'react-bootstrap'

// styles
import classes from 'styles/public/home/projects.module.scss'

// types
import { FC } from 'react'
import { Card } from '@molecules/card'

export const Projects: FC = () => {
  const personalProjects = [
    {
      name: 'Florül',
      url: 'https://florul-jmv.vercel.app',
      picture: 'https://florul-jmv.vercel.app/assets/reason/witch.jpg'
    }
  ]

  return (
    <Container as='section' className={classes.projects}>
      <Row>
        {personalProjects.map((project) => (
          <Col sm={6} lg={4} xl={3} key={project.name}>
            <Link passHref href={project.url}>
              <a target='_blank'>
                <Card {...project} />
              </a>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
