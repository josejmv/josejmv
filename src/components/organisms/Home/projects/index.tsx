// main tools
import Link from 'next/link'

// bootstrap components
import { Container, Row, Col, Card } from 'react-bootstrap'

// styles
import classes from 'styles/public/home/projects.module.scss'

// types
import { FC } from 'react'

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
      <h2 className={classes.title}>Proyectos personales</h2>
      <Row>
        {personalProjects.map((project) => (
          <Col sm={6} lg={4} xl={3} key={project.name}>
            <Link passHref href={project.url}>
              <a target='_blank'>
                <Card role='button' className={classes.card}>
                  <Card.Img
                    alt={project.name}
                    src={project.picture}
                    className={classes.card_img}
                  />
                  <Card.ImgOverlay className={classes.card_overlay}>
                    <Card.Footer className={classes.card_footer}>
                      <Card.Title className={classes.card_title}>
                        {project.name}
                      </Card.Title>
                    </Card.Footer>
                  </Card.ImgOverlay>
                </Card>
              </a>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
