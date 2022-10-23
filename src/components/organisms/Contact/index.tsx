// bootstrap components
import { Container } from 'react-bootstrap'

// styles
import classes from 'styles/public/contact/styles.module.scss'

// types
import { FC } from 'react'

export const ContactPage: FC = () => {
  return (
    <>
      <Container className={classes.contact}>
        <h1 className={classes.title}>Contáctame</h1>
      </Container>
    </>
  )
}
