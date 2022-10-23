// main tools
import Image from 'next/image'
import dayjs from 'dayjs'

// bootstrap components
import { Container, Row, Col } from 'react-bootstrap'

// styles
import classes from 'styles/public/home/styles.module.scss'

// types
import { FC } from 'react'

export const HomePage: FC = () => {
  const begginingDate = dayjs().set('year', 2019)

  return (
    <Container className={classes.home}>
      <Row className={classes.container}>
        <Col lg={6}>
          <div className={classes.profile}>
            <Image
              width={300}
              height={300}
              alt='profile'
              objectFit='cover'
              className={classes.profile_pic}
              src='/assets/img/profile.jpg'
            />
          </div>
          <h1 className={`mt-5 ${classes.title}`}>Jose Vasquez</h1>
        </Col>
      </Row>
    </Container>
  )
}
