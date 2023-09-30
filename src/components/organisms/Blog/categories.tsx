// main tools
import Link from 'next/link'

// components
import { GenericCard } from '@molecules/card'

// bootstrap components
import { Container, Row, Col } from 'react-bootstrap'

// utils
import { categories } from './utils'

// styles
import classes from 'styles/pages/blog/categories/styles.module.scss'

// types
import { FC } from 'react'

export const BlogCategoriesPage: FC = () => (
  <Container as='section' className={classes.blog}>
    <h1 className={classes.title}>Categorías</h1>
    <Row>
      {categories.map(({ url, ...category }) => (
        <Col sm={6} lg={4} xl={3} key={category.name}>
          <Link passHref href={url}>
            <GenericCard {...category} />
          </Link>
        </Col>
      ))}
    </Row>
  </Container>
)
