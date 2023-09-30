// main tools
import Image from 'next/image'
import Link from 'next/link'

// components
import { DivMotion } from '@atoms/animations'

// bootstrap components
import { Whatsapp, Telegram, Download } from 'react-bootstrap-icons'
import { Container, Row, Col, Button } from 'react-bootstrap'

// utils
import { animations, info, rrss, whatsappUrl } from './utils'
import { fadeIn } from '@atoms/animations/utils'

// hooks
import { useApp } from 'hooks/use-app'

// styles
import classes from './styles.module.scss'

// main tools
import { FC } from 'react'

export const ProfileCard: FC = () => {
  const { toast } = useApp()

  /**
   * handle show toast on downloaded file
   */
  const handleDownloadFile = () =>
    toast()?.show({
      summary: 'Éxito!',
      severity: 'success',
      detail: 'Árchivo descargado con éxito'
    })

  return (
    <DivMotion {...fadeIn}>
      <article className={classes.profile}>
        <DivMotion {...animations.iconsAnimation}>
          <div className={classes.avatar}>
            <Image
              width={80}
              height={80}
              alt='profile'
              src='/assets/pics/profile.jpg'
            />
          </div>
          <h2 className={classes.title}>José Vasquez</h2>
          <span className={classes.small}>Frontend developer</span>

          <nav>
            <ul className={classes.rrss}>
              {rrss.map(({ link, Icon }) => (
                <li key={link} className={classes.item}>
                  <Link href={link}>
                    <Icon size={32} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </DivMotion>

        <DivMotion {...animations.textsAnimation}>
          <Container as='section'>
            <Row className={classes.info}>
              {info.map((item, idx) => (
                <Col key={idx} xs={4}>
                  <p className={classes.title}>{item.title}</p>
                  <span className={classes.subtitle}>{item.description}</span>
                </Col>
              ))}
            </Row>

            <Row className={classes.actions}>
              <Col className='mb-3' lg={12}>
                <a download href='/assets/cv/Jose_Vasquez.pdf'>
                  <Button
                    className={classes.button}
                    onClick={handleDownloadFile}>
                    <Download className='me-2' size={16} /> Descargar CV
                  </Button>
                </a>
              </Col>
              <Col xs='auto'>
                <Link target='_blank' href={whatsappUrl}>
                  <Button className={classes.button}>
                    <Whatsapp size={24} />
                  </Button>
                </Link>
              </Col>
              <Col xs='auto'>
                <Link target='_blank' href='https://t.me/+584147545160'>
                  <Button className={classes.button}>
                    <Telegram size={24} />
                  </Button>
                </Link>
              </Col>
            </Row>
          </Container>
        </DivMotion>
      </article>
    </DivMotion>
  )
}
