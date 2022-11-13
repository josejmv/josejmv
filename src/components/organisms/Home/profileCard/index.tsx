// main tools
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'

// components
import { fadeIn } from '@atoms/animations/utils'
import { DivMotion } from '@atoms/animations'
import { animations } from './utils'

// bootstrap components
import {
  Github,
  Linkedin,
  Whatsapp,
  Telegram,
  Download,
  Instagram
} from 'react-bootstrap-icons'
import { Container, Row, Col, Button } from 'react-bootstrap'

// hooks
import { useApp } from 'hooks/useApp'

// styles
import classes from 'styles/public/home/profileCard.module.scss'

// main tools
import { FC } from 'react'

export const ProfileCard: FC = () => {
  const { toast } = useApp()
  const timezoneCode = 'America/Caracas'
  const startWorkDate = dayjs('04/30/2019').tz(timezoneCode)
  const whatsappUrl =
    'https://api.whatsapp.com/send/?phone=%2B584147545160&text=Hola,%20Jose%20Manuel%20mucho%20gusto.&type=phone_number&app_absent=0'

  const rrss = [
    { link: 'https://www.linkedin.com/in/josejmv/', Icon: Linkedin },
    { link: 'https://github.com/josejmv', Icon: Github },
    { link: 'https://instagram.com/josemvasquezv/', Icon: Instagram }
  ]

  const info = [
    {
      title: dayjs().tz(timezoneCode).diff(startWorkDate, 'year'),
      description: 'Años de experiencia'
    },
    { title: 'Senior', description: 'Desarrollador web' },
    { title: 'Next.js', description: 'Framework dominante' }
  ]

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
                    <a>
                      <Icon size={32} />
                    </a>
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
                <Link href={whatsappUrl}>
                  <a target='_blank'>
                    <Button className={classes.button}>
                      <Whatsapp size={24} />
                    </Button>
                  </a>
                </Link>
              </Col>
              <Col xs='auto'>
                <Link href='https://t.me/+584147545160'>
                  <a target='_blank'>
                    <Button className={classes.button}>
                      <Telegram size={24} />
                    </Button>
                  </a>
                </Link>
              </Col>
            </Row>
          </Container>
        </DivMotion>
      </article>
    </DivMotion>
  )
}
