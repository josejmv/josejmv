// main tools
import Link from 'next/link'

// components
import { Card } from '@molecules/card'

// bootstrap components
import { Container, Row, Col } from 'react-bootstrap'

// styles
import classes from 'styles/public/blog/styles.module.scss'

// types
import { FC } from 'react'

export const BlogPage: FC = () => {
  const categories = [
    {
      name: 'Cursos',
      url: '/blog/courses',
      picture: 'https://florul-jmv.vercel.app/assets/reason/witch.jpg'
    },
    {
      name: 'Monologos',
      url: '/blog/monologues',
      picture: 'https://florul-jmv.vercel.app/assets/reason/witch.jpg'
    },
    {
      name: 'Poemas',
      url: '/blog/poems',
      picture: 'https://florul-jmv.vercel.app/assets/reason/witch.jpg'
    },
    {
      name: 'Directos',
      url: '/blog/lives',
      picture: 'https://florul-jmv.vercel.app/assets/reason/witch.jpg'
    }
  ]

  return (
    <Container as='section' className={classes.blog}>
      <h1 className={classes.title}>Categorías</h1>
      <Row>
        {categories.map((category) => (
          <Col sm={6} lg={4} xl={3} key={category.name}>
            <Link passHref href={category.url}>
              <a>
                <Card {...category} />
              </a>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
