// main tools
import Image from 'next/image'

// styles
import classes from 'styles/public/experience/slides/centria.module.scss'

// types
import { FC } from 'react'

export const CentriaExperience: FC = () => (
  <article className={classes.centria}>
    <h2 className={classes.subtitle}>Mi experiencia en The Centria Group</h2>

    <div className='mt-4 w-100 text-center'>
      <Image
        width={300}
        height={60}
        alt='Redleaf'
        objectFit='contain'
        className={classes.redleaf}
        src='/assets/pics/centria/redleaf.svg'
      />
    </div>
    <h3 className={classes.small}>2021</h3>
    <p>
      Inicié en The Centria Group como desarrollador web frontend, contratado
      por mis conocimientos en Next.js para realizar una migración de un
      proyecto hecho inicialmente en React.js bajo una modalidad de trabajo
      completamente remota
    </p>
    <p>
      Posterior a eso, aplicando mi máximo esfuerzo fuí poco a poco ganando la
      confianza de mis compañeros para asi, en conjunto al resto del equipo,
      poder elaborar sitios web de alta calidad y buena escalabilidad, aplicando
      la metodología scrum bajo gestores de proyectos como notion
    </p>
    <p>
      Trabajé en proyectos de gran escala como lo es Redleaf, agencia
      Canadience, la cual requería tanto de un sitio web el cual recibiría mucho
      tráfico de usuarios, como a su vez, un dashboard administrativo, el cual
      debería gestionar toda la información de los usuarios que hagan vida en el
      sitio web, haciendo una interfaz solida, entendible y segura
    </p>

    <div className='mt-5 w-100 text-center'>
      <Image
        width={300}
        height={120}
        alt='Redleaf'
        className={classes.centria}
        src='/assets/pics/centria/mindfit.svg'
      />
    </div>
    <h3 className={classes.small}>2022</h3>

    <p>
      Luego, habiendo ascendido a lider del equipo de desarrollo frontend,
      comenzamos el proyecto Mindfit, el cual supondria un reto mucho mas grande
      para mí ya que tendria que aplicar todos los conocimientos adquiridos
      hasta ahora en gestion de proyectos, liderazgo, investigación y aplicacion
      de tecnologias que hasta entonces aún no habia utilizado como sistemas de
      videollamadas y manejo de herramientas del dispositivo como camara y
      microfono, por lo cual tuve que empezar a estudiar tambien testing con
      cypress ya que al ir creciendo el proyecto me fui dando cuenta de la
      importancia de los test en un sistema, para poder tambien mantener la
      estabilidad del mismo
    </p>

    <div className='mt-5 w-100 text-center'>
      <Image
        width={300}
        height={160}
        alt='Redleaf'
        className={classes.centria}
        src='/assets/pics/centria/dr-keyword.svg'
      />
    </div>
    <h3 className={classes.small}>2023</h3>

    <p>
      Posterior a mindfit comence un nuevo proyecto llamado Dr Keyword, la cual
      es una plataforma enfocada en la elaboracion de campañas por medio de la
      modalidad de guest posting, utilizando chat gpt e inteligencia artificial
      para facilitar el proceso de redaccion, analisis y consejos de publicacion
      a los usuarios de esta plataforma
    </p>
    <p>
      Desempeñando mi rol como lider de equipo, me encargué de la gestion del
      proyecto, la arquitectura a llevar a cabo y a su vez me encargue de crear
      una libreria UI para facilitar la elaboracion de este y futuros proyectos
    </p>
  </article>
)
