// main tools
import { useState } from 'react'
import dynamic from 'next/dynamic'

// next components
import Image from 'next/image'

// bootstrap components
import { Row, Col } from 'react-bootstrap'

// styles
import styles from 'styles/pages/progress.module.scss'

// type
import type { FC } from 'react'

export const Platzi: FC = () => {
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
      <h2 className={styles.article_title}>Platzi</h2>
      <Row className={styles.article_row}>
        <Col className={styles.article_col} xs={12} md={6}>
          <h4>Recibi la beca de platzi en 2019 ofrecida a los venezolanos</h4>
          <p>
            Esta beca me permitio impulsar mis conocimientos y mis habilidades
            de forma mucho mas rapida y efectiva, participando en una gran
            cantidad de cursos y presentando pruebas que hicieron que mis
            conocimientos fueran siendo cada vez mas solidos.
          </p>
          <p>
            Aprendiendo buenas practicas, estructura de codigo, manejo de datos
            y logica de programacion de profesionales altamente capacitados, sin
            dudas una experiencia muy gratificante para mi impulso personal y
            profesional
          </p>
          <p>
            Altamente recomendada la adquisicion de una membresía en platzi para
            poder tener acceso a su contenido, en esta plataforma hay una gran
            cantidad de cursos de muy alto nivel y de muchas areas
          </p>
          <i>Nunca pares de aprender!</i>
        </Col>
        <Col className={styles.article_col} xs={12} md={6}>
          <Row className={styles.article_row}>
            {images.map((img, idx) => (
              <Col key={idx} xs={12} sm={6} md={12} lg={12} xl={6}>
                <Image
                  onClick={() => handleClick(idx)}
                  className={styles.article_col_image}
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={250}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <ReactViewer
        noNavbar
        drag={false}
        rotatable={false}
        scalable={false}
        zIndex={9999}
        visible={visible}
        images={images}
        activeIndex={key}
        onClose={() => setVisible(false)}
      />
    </article>
  )
}
