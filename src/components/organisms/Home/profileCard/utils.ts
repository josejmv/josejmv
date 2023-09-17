// main tools
import dayjs from 'dayjs'

// utils
import { bottomToTop, topToBottom } from '@atoms/animations/utils'

// icons
import { Github, Linkedin, Instagram } from 'react-bootstrap-icons'

const timezoneCode = 'America/Caracas'
const startWorkDate = dayjs('04/30/2019').tz(timezoneCode)

export const animations = {
  iconsAnimation: {
    ...topToBottom,
    transition: { ...topToBottom.transition, delay: 0.3 }
  },
  textsAnimation: {
    ...bottomToTop,
    transition: { ...bottomToTop.transition, delay: 0.6 }
  }
}

export const rrss = [
  { link: 'https://www.linkedin.com/in/josejmv/', Icon: Linkedin },
  { link: 'https://github.com/josejmv', Icon: Github },
  { link: 'https://instagram.com/josemvasquezv/', Icon: Instagram }
]

export const info = [
  {
    title: dayjs().tz(timezoneCode).diff(startWorkDate, 'year'),
    description: 'Años de experiencia'
  },
  { title: 'Senior', description: 'Desarrollador web' },
  { title: 'Next.js', description: 'Framework dominante' }
]
