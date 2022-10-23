// bootstrap components
import { Container } from 'react-bootstrap'

// styles
import classes from 'styles/public/skills/styles.module.scss'

// types
import { FC } from 'react'

export const SkillsPage: FC = () => {
  return (
    <>
      <Container className={classes.contact}>
        <h1 className={classes.title}>Habilidades</h1>
      </Container>
    </>
  )
}
