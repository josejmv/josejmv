// main tools
import Image from 'next/image'

// prime components
import { Galleria } from 'primereact/galleria'

// styles
import classes from 'styles/public/experience/slides/seocontenidos.module.scss'

// types
import { FC } from 'react'

export const SeoContenidosExperience: FC = () => {
  const pics = Array.from(Array(7).keys()).map((item) => ({
    image: `/assets/pics/${item + 1}.jpg`,
    alt: 'platzi',
  }))

  const itemTemplate = (pic: typeof pics[number]) => (
    <Image
      width={400}
      height={400}
      alt={pic.alt}
      src={pic.image}
      objectFit='cover'
    />
  )
  const thumbnailTemplate = (pic: typeof pics[number]) => (
    <Image
      width={50}
      height={50}
      alt={pic.alt}
      src={pic.image}
      objectFit='cover'
    />
  )

  return (
    <article className={classes.platzi}>
      <h2 className={classes.subtitle}>Mi experiencia en Seo Contenidos</h2>

      <h3 className={classes.small}>2019</h3>

      <div className='my-5'>
        <Galleria
          value={pics}
          item={itemTemplate}
          thumbnail={thumbnailTemplate}
        />
      </div>
    </article>
  )
}
