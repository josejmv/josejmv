// prime components
import { Image } from 'primereact/image'

// styles
import classes from './styles.module.scss'

// types
import { FC } from 'react'

export const PlatziExperience: FC = () => {
  const pics = Array.from(Array(7).keys()).map((idx) => ({
    image: `/assets/pics/platzi-conf/${idx + 1}.jpg`,
    alt: 'platzi'
  }))

  const certificates = Array.from(Array(7).keys()).map((idx) => ({
    image: `/assets/certificates/${idx + 1}.jpg`,
    alt: 'platzi certificate'
  }))

  return (
    <article className={classes.platzi}>
      <h2 className={classes.subtitle}>Mi experiencia en platzi</h2>

      <h3 className={classes.small}>2019</h3>
      <p>
        Conocí platzi durante mi tiempo en la universidad, aproximadamente en
        febrero del 2019, donde me enteré de que estaban ofreciendo becas por un
        año de acceso a todo el contenido de la plataforma, beca por la cual me
        postulé y finalmente me la aprobaron
      </p>
      <p>
        Ese fue el inicio de mi enfoque profesional, bajo el cual indague en
        tantos cursos como pude y averigue todo lo que me fue posible acerca de
        las herramientas mas demandadas por le mercado laboral y tambien los
        conocimientos básicos que deberia tener un desarrollador web.
        Conocimientos que he ido desarrollando, puliendo y dominando con el paso
        del tiempo y con las experiencias laborales que he tenido el gusto de ir
        teniendo
      </p>

      <div className='my-4'>
        {certificates.map((pic) => (
          <Image
            preview
            width='120'
            height='120'
            alt={pic.alt}
            key={pic.image}
            src={pic.image}
            className={classes.pic}
          />
        ))}
      </div>
      <h3 className={classes.small}>2022</h3>
      <p>
        Adquirí nuevamente, en colaboracion con un amigo, el plan de platzi
        expert duo, luego de 2 años desconectado de platzi, con la finalidad de
        continuar aprendiendo y mejorando mis habilidades en herramientas ya mas
        profesionales necesarias para poder conseguir un seniority mas adecuado
        a mi trabajo, poder optimizar mi proceso de desarrollo, preparar tests y
        adquirir conocimientos mas avanzados, ademas de continuar desarrollando
        otras habilidades blandas que es importante tener en cuenta
      </p>
      <p>
        Finalmente luego de haber adquirido el plan expert duo, planifique mi
        asistencia a la platzi conf, celebrada en Bogotá, experiencia que fue
        para mi sumamente enriquesedora y super motivadora a seguir aprendiendo
        e introduciendome aun mas en comunidades de desarrollo para poder estar
        mas al dia con respecto a nuevas actualizaciones de lenguajes y
        herramientas que mejoran, optimizan y enriquecen la calidad del codigo
        para poder elaborar proyectos mas profesionales. Experiencia super
        recomendada y a la cual espero poder continuar asistiendo en los años
        venideros
      </p>

      <div className='my-4'>
        {pics.map((pic) => (
          <Image
            preview
            width='120'
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
