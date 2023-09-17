// main tools
import Image from 'next/image'

// styles
import classes from 'styles/public/experience/slides/trades.module.scss'

// types
import { FC } from 'react'

export const TradesExperience: FC = () => (
  <article className={classes.trades}>
    <h2 className={classes.subtitle}>Mi experiencia en Trades.org</h2>
    <div className='mt-4 w-100 text-center'>
      <Image
        width={300}
        height={60}
        alt='Redleaf'
        objectFit='contain'
        className={classes.redleaf}
        src='/assets/pics/trades-org/logo.svg'
      />
    </div>
    <h3 className={classes.small}>2023</h3>
    <p>
      Conseguí este trabajo gracias a LinkedIn, donde me contactaron para
      trabajar en una empresa de Estados Unidos que se dedica a la creación de
      sitios web para empresas que buscan empleados en diferentes áreas y
      nichos.
    </p>
    <p>
      Mi principal rol en este trabajo fue encargarme de la traducción de los
      proyectos que la agencia ya tenía elaborados, ya que querían ampliar su
      área de trabajo a países de habla hispana y Europa.
    </p>
    <p>
      Después de haber realizado la investigación, planificación y ejecución de
      las traducciones, se me encargó continuar con los últimos preparativos y
      correcciones para poder desplegar la versión más actualizada de los
      proyectos en los distintos entornos de producción.
    </p>
  </article>
)
