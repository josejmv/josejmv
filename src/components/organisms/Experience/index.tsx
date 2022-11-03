// components
import { SeoContenidosExperience } from './slides/seocontenidos'
import { CentriaExperience } from './slides/centria'
import { PlatziExperience } from './slides/platzi'

// bootstrap components
import { Container, Carousel } from 'react-bootstrap'

// styles
import classes from 'styles/public/experience/styles.module.scss'

// types
import { FC } from 'react'

export const Experience: FC = () => {
  return (
    <>
      <Container className={classes.experience}>
        <h1 className={classes.title}>Experiencia</h1>

        <Carousel wrap={false} interval={null} className={classes.carousel}>
          <Carousel.Item>
            <PlatziExperience />
          </Carousel.Item>
          <Carousel.Item>
            <SeoContenidosExperience />
          </Carousel.Item>
          <Carousel.Item>
            <CentriaExperience />
          </Carousel.Item>
        </Carousel>
      </Container>
    </>
  )
}
