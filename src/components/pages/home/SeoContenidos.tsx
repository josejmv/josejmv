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
    </article>
  )
}
