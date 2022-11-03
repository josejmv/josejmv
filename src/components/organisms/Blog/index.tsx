// bootstrap components
import { Container } from 'react-bootstrap'

// styles
import classes from 'styles/public/blog/styles.module.scss'

// types
import { FC } from 'react'

export const BlogPage: FC = () => {
  return (
    <Container className={classes.home}>
      <h1 className={classes.title}>Blog</h1>
    </Container>
  )
}
