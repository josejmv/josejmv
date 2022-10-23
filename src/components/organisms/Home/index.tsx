// bootstrap components
import { Container } from 'react-bootstrap'

// styles
import classes from 'styles/public/home/styles.module.scss'

// types
import { FC } from 'react'

export const HomePage: FC = () => {
  return (
    <Container className={classes.home}>
      <h1 className={classes.title}>Inicio</h1>
    </Container>
  )
}
