// main tools
import { useState } from 'react'
import dynamic from 'next/dynamic'

// next components
import Image from 'next/image'

// components
import { NextRight } from 'components/atoms'

// bootstrap components
import { Row, Col, Carousel } from 'react-bootstrap'

// styles
import styles from 'styles/pages/progress.module.scss'

// types
import type { FC } from 'react'

export const Centria: FC = () => {
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
      <h2 className={styles.article_title}>The Centria Group</h2>
      <Row className={styles.article_row}>
        <Col className={styles.article_col} xs={12} md={6}>
          <h4>Comence a trabajar en Centria a principios del 2021</h4>
          <p>
            Actualmente me encuentro trabajando en Centria, desempeñandome como
            Frontend developer en sitios webs elaborados con Next.js. En esta
            agencia he aprendido muchisimas mas herramientas que me complementan
            para poder desarrollar sitios webs mucho mas rapidos, con buenas
            practicas y tambien de manera mas escalable
          </p>
          <p>
            Junto con todo el equipo de programacion siento que mis habilidades
            han ido mejorando mucho, y a su vez mi aporte a la empresa ha sudo
            muy bien recibido, colaborando para dar siempre lo mejor para poder
            salir adelante como equipo y dar soluciones optimas y acertadas ante
            cualquier inconveniente o modulo nuevo
          </p>
        </Col>
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
        {/* <NextRight href='/blog'>Echa un vistazo a mi blog</NextRight> */}
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
