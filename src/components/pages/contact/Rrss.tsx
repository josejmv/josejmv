// next components
import Image from 'next/image'

// styles
import styles from 'styles/pages/contact.module.scss'

// types
import type { FC } from 'react'

export const Rrss: FC = () => (
  <>
    <h2>Redes sociales</h2>
    <p>
      Usualmente utilizo Instagram como red social ya que me siento mas comodo
      con dicha plataforma 😀
    </p>
    <p>
      Tambien utilizo mucho Github para ver los proyectos de mis compañeros y
      amigos y asi continuar aprendiendo tecnicas y herramientas 🧐💻
    </p>
    <a className={styles.rrss} href='https://instagram.com/josemvasquezv'>
      <Image
        src='/logos/instagram.svg'
        height={25}
        width={25}
        alt='instagram'
      />
      <span className='pl-3'>@josemvasquezv</span>
    </a>
    <a className={styles.rrss} href='https://github.com/josejmv'>
      <Image src='/logos/github.svg' height={25} width={25} alt='github' />
      <span className='pl-3'>@josejmv</span>
    </a>
  </>
)
