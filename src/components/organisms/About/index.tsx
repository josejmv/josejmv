// bootstrap components
import { Container } from 'react-bootstrap'

// styles
import classes from 'styles/public/about/styles.module.scss'

// types
import { FC } from 'react'

export const AboutPage: FC = () => {
  return (
    <>
      <Container className={classes.about}>
        <h1 className={classes.title}>Sobre mí</h1>
      </Container>
    </>
  )
}
