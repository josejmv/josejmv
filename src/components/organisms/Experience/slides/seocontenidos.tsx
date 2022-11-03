// prime components
import { Image } from 'primereact/image'

// styles
import classes from 'styles/public/experience/slides/seocontenidos.module.scss'

// types
import { FC } from 'react'

export const SeoContenidosExperience: FC = () => {
  const pics = Array.from(Array(3).keys()).map((idx) => ({
    image: `/assets/pics/seocontenidos/${idx + 1}.jpg`,
    alt: 'seocontenidos',
  }))

  return (
    <article className={classes.seocontenidos}>
      <h2 className={classes.subtitle}>Mi experiencia en Seo Contenidos</h2>

      <h3 className={classes.small}>2020</h3>
      <p>
        Como primer experiencia laboral, obtuve un puesto de desarrollador web
        en wordpress con Seo contenidos, agencia de marketing digital, bajo la
        cual aprendí bastantes conceptos de alojamientos de sitios web,
        dominios, cors, optimizacion y mucha configuración de SEO
      </p>

      <p>
        Participe en muchos proyectos tanto como desarrollador como tambien en
        la planificación bajo la metodologia scrum, adquiriendo conocimientos de
        liderazgo, gestión de proyectos, metodologías ágiles y tambien,
        comunicación con clientes para poder planificar proyectos a desarrollar
        bajo los requerimientos solicitados en los mejores tiempos posíbles
      </p>

      <div className='my-4'>
        {pics.map((pic) => (
          <Image
            preview
            width='230'
            height='120'
            alt={pic.alt}
            key={pic.image}
            src={pic.image}
            className={classes.pic}
          />
        ))}
      </div>
    </article>
  )
}
