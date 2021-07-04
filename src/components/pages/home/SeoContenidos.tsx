// main tools
import { useState } from 'react'
import dynamic from 'next/dynamic'

// next components
import Image from 'next/image'

// bootstrap components
import { Row, Col, Carousel } from 'react-bootstrap'

// styles
import styles from 'styles/pages/progress.module.scss'

// types
import type { FC } from 'react'

export const SeoContenidos: FC = () => {
  const [visible, setVisible] = useState(false)
  const [key, setKey] = useState(0)
  const ReactViewer = dynamic(() => import('react-viewer'), { ssr: false })

  const images = [
    { src: '/certified/datos.jpg', alt: 'bases de datos' },
    { src: '/certified/php.jpg', alt: 'PHP' },
    { src: '/certified/react.jpg', alt: 'React' },
  ]

  const handleClick = (idx: number) => {
    setKey(idx)
    setVisible(true)
  }

  return (
    <article className={styles.article}>
      <h2 className={styles.article_title}>Seo Contenidos</h2>
      <Row className={styles.article_row}>
        <Col className={styles.article_col} xs={12} md={6}>
          <Carousel fade pause={false} interval={2000}>
            {images.map((img, idx) => (
              <Carousel.Item key={idx} onClick={() => handleClick(idx)}>
                <Image
                  className={styles.article_col_image}
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={450}
                  objectFit='contain'
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        <Col className={styles.article_col} xs={12} md={6}>
          <h4>
            Comence a trabajar en Seo Contenidos: Agencia de marketing digital
            en 2020
          </h4>
          <p>
            Desempeñandome en el area de programacion y desarrollo web, obtuve
            mi primer trabajo en seo contenidos, el cual estuvo lleno de muchas
            experiencias llenas de aprendizajes, estres, satisfacciones y por
            sobre todo muchas amistades y buenos recuerdos
          </p>
          <p>
            Dure alrededor de 1 año y 2 meses trabajando en Seo Contenidos, en
            donde tambien me desempeñe como lider del equipo de programacion
            durante unos 3 meses aproximadamente, en dicha labor comprendi
            tambien muchos aspectos mas ademas de solo escribir codigo, aprendi
            como manegar y gestionar un proyecto, como organizarlo y como
            calcular las tareas, la dificultad y el tiempo de ejecucion de las
            mismas, basandome en la metodologia SCRUM
          </p>
        </Col>
      </Row>
      <ReactViewer
        noNavbar
        drag={false}
        rotatable={false}
        scalable={false}
        zIndex={9999}
        visible={visible}
        activeIndex={key}
        images={images}
        onClose={() => setVisible(false)}
      />
      <style jsx>{`
        article {
          background-color: #ffe2a3;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='100%25' gradientTransform='rotate(180,767,381)'%3E%3Cstop offset='0' stop-color='%23ffe2a3'/%3E%3Cstop offset='1' stop-color='%23d3e1ff'/%3E%3C/linearGradient%3E%3Cpattern patternUnits='userSpaceOnUse' id='b' width='419' height='349.2' x='0' y='0' viewBox='0 0 1080 900'%3E%3Cg fill-opacity='0.07'%3E%3Cpolygon fill='%23444' points='90 150 0 300 180 300'/%3E%3Cpolygon points='90 150 180 0 0 0'/%3E%3Cpolygon fill='%23AAA' points='270 150 360 0 180 0'/%3E%3Cpolygon fill='%23DDD' points='450 150 360 300 540 300'/%3E%3Cpolygon fill='%23999' points='450 150 540 0 360 0'/%3E%3Cpolygon points='630 150 540 300 720 300'/%3E%3Cpolygon fill='%23DDD' points='630 150 720 0 540 0'/%3E%3Cpolygon fill='%23444' points='810 150 720 300 900 300'/%3E%3Cpolygon fill='%23FFF' points='810 150 900 0 720 0'/%3E%3Cpolygon fill='%23DDD' points='990 150 900 300 1080 300'/%3E%3Cpolygon fill='%23444' points='990 150 1080 0 900 0'/%3E%3Cpolygon fill='%23DDD' points='90 450 0 600 180 600'/%3E%3Cpolygon points='90 450 180 300 0 300'/%3E%3Cpolygon fill='%23666' points='270 450 180 600 360 600'/%3E%3Cpolygon fill='%23AAA' points='270 450 360 300 180 300'/%3E%3Cpolygon fill='%23DDD' points='450 450 360 600 540 600'/%3E%3Cpolygon fill='%23999' points='450 450 540 300 360 300'/%3E%3Cpolygon fill='%23999' points='630 450 540 600 720 600'/%3E%3Cpolygon fill='%23FFF' points='630 450 720 300 540 300'/%3E%3Cpolygon points='810 450 720 600 900 600'/%3E%3Cpolygon fill='%23DDD' points='810 450 900 300 720 300'/%3E%3Cpolygon fill='%23AAA' points='990 450 900 600 1080 600'/%3E%3Cpolygon fill='%23444' points='990 450 1080 300 900 300'/%3E%3Cpolygon fill='%23222' points='90 750 0 900 180 900'/%3E%3Cpolygon points='270 750 180 900 360 900'/%3E%3Cpolygon fill='%23DDD' points='270 750 360 600 180 600'/%3E%3Cpolygon points='450 750 540 600 360 600'/%3E%3Cpolygon points='630 750 540 900 720 900'/%3E%3Cpolygon fill='%23444' points='630 750 720 600 540 600'/%3E%3Cpolygon fill='%23AAA' points='810 750 720 900 900 900'/%3E%3Cpolygon fill='%23666' points='810 750 900 600 720 600'/%3E%3Cpolygon fill='%23999' points='990 750 900 900 1080 900'/%3E%3Cpolygon fill='%23999' points='180 0 90 150 270 150'/%3E%3Cpolygon fill='%23444' points='360 0 270 150 450 150'/%3E%3Cpolygon fill='%23FFF' points='540 0 450 150 630 150'/%3E%3Cpolygon points='900 0 810 150 990 150'/%3E%3Cpolygon fill='%23222' points='0 300 -90 450 90 450'/%3E%3Cpolygon fill='%23FFF' points='0 300 90 150 -90 150'/%3E%3Cpolygon fill='%23FFF' points='180 300 90 450 270 450'/%3E%3Cpolygon fill='%23666' points='180 300 270 150 90 150'/%3E%3Cpolygon fill='%23222' points='360 300 270 450 450 450'/%3E%3Cpolygon fill='%23FFF' points='360 300 450 150 270 150'/%3E%3Cpolygon fill='%23444' points='540 300 450 450 630 450'/%3E%3Cpolygon fill='%23222' points='540 300 630 150 450 150'/%3E%3Cpolygon fill='%23AAA' points='720 300 630 450 810 450'/%3E%3Cpolygon fill='%23666' points='720 300 810 150 630 150'/%3E%3Cpolygon fill='%23FFF' points='900 300 810 450 990 450'/%3E%3Cpolygon fill='%23999' points='900 300 990 150 810 150'/%3E%3Cpolygon points='0 600 -90 750 90 750'/%3E%3Cpolygon fill='%23666' points='0 600 90 450 -90 450'/%3E%3Cpolygon fill='%23AAA' points='180 600 90 750 270 750'/%3E%3Cpolygon fill='%23444' points='180 600 270 450 90 450'/%3E%3Cpolygon fill='%23444' points='360 600 270 750 450 750'/%3E%3Cpolygon fill='%23999' points='360 600 450 450 270 450'/%3E%3Cpolygon fill='%23666' points='540 600 630 450 450 450'/%3E%3Cpolygon fill='%23222' points='720 600 630 750 810 750'/%3E%3Cpolygon fill='%23FFF' points='900 600 810 750 990 750'/%3E%3Cpolygon fill='%23222' points='900 600 990 450 810 450'/%3E%3Cpolygon fill='%23DDD' points='0 900 90 750 -90 750'/%3E%3Cpolygon fill='%23444' points='180 900 270 750 90 750'/%3E%3Cpolygon fill='%23FFF' points='360 900 450 750 270 750'/%3E%3Cpolygon fill='%23AAA' points='540 900 630 750 450 750'/%3E%3Cpolygon fill='%23FFF' points='720 900 810 750 630 750'/%3E%3Cpolygon fill='%23222' points='900 900 990 750 810 750'/%3E%3Cpolygon fill='%23222' points='1080 300 990 450 1170 450'/%3E%3Cpolygon fill='%23FFF' points='1080 300 1170 150 990 150'/%3E%3Cpolygon points='1080 600 990 750 1170 750'/%3E%3Cpolygon fill='%23666' points='1080 600 1170 450 990 450'/%3E%3Cpolygon fill='%23DDD' points='1080 900 1170 750 990 750'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect x='0' y='0' fill='url(%23a)' width='100%25' height='100%25'/%3E%3Crect x='0' y='0' fill='url(%23b)' width='100%25' height='100%25'/%3E%3C/svg%3E");
          background-size: cover;
        }
      `}</style>
    </article>
  )
}
