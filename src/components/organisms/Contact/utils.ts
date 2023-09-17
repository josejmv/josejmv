import {
  Github,
  Linkedin,
  Whatsapp,
  Instagram,
  EnvelopeFill
} from 'react-bootstrap-icons'

export const email = 'josejmvasquez@gmail.com'
export const githubUrl = 'https://github.com/josejmv'
export const linkedinUrl = 'https://www.linkedin.com/in/josejmv/'
export const instagramUrl = 'https://www.instagram.com/josemvasquezv/'
export const whatsappUrl =
  'https://api.whatsapp.com/send/?phone=%2B584147545160&text=Hola,%20Jose%20Manuel%20mucho%20gusto.&type=phone_number&app_absent=0'

export const items = [
  {
    icon: Whatsapp,
    label: 'Whatsapp',
    href: whatsappUrl
  },
  {
    icon: EnvelopeFill,
    href: `mailto:${email}`,
    label: 'Correo electrónico'
  },
  {
    icon: Linkedin,
    label: '@josejmv',
    href: linkedinUrl
  }
]

export const rrss = [
  {
    icon: Instagram,
    href: instagramUrl,
    label: '@josemvasquezv'
  },
  {
    icon: Github,
    href: githubUrl,
    label: '@josejmv'
  }
]
