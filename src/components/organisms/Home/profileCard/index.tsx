// main tools
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'

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
    <article className={classes.profile}>
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
            <li className={classes.item} key={link}>
              <Link href={link}>
                <a>
                  <Icon size={32} />
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Container as='section'>
        <Row className={classes.info}>
          <Col xs={4}>
            <p className={classes.title}>
              {dayjs().tz(timezoneCode).diff(startWorkDate, 'year')}
            </p>
            <span className={classes.subtitle}>Años de experiencia</span>
          </Col>
          <Col xs={4}>
            <p className={classes.title}>Senior</p>
            <span className={classes.subtitle}>Desarrollador web</span>
          </Col>
          <Col xs={4}>
            <p className={classes.title}>Next.js</p>
            <span className={classes.subtitle}>Framework dominante</span>
          </Col>
        </Row>

        <Row className={classes.actions}>
          <Col className='mb-3' lg={12}>
            <a download href='/assets/cv/Jose_Vasquez.pdf'>
              <Button onClick={handleDownloadFile}>
                Descargar CV <Download className='ms-2' size={16} />
              </Button>
            </a>
          </Col>
          <Col xs='auto'>
            <Link href={whatsappUrl}>
              <a target='_blank'>
                <Button>
                  <Whatsapp size={24} />
                </Button>
              </a>
            </Link>
          </Col>
          <Col xs='auto'>
            <Link href='https://t.me/+584147545160'>
              <a target='_blank'>
                <Button>
                  <Telegram size={24} />
                </Button>
              </a>
            </Link>
          </Col>
        </Row>
      </Container>
    </article>
  )
}
