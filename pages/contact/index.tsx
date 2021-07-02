// components
import { Layout } from 'components/Layout'

// styles
import styles from 'styles/home.module.scss'

// types
import type { FC } from 'react'

const Contact: FC = () => (
  <Layout>
    <div className={styles.container}>
      <h1>Contactame 😀</h1>
    </div>
  </Layout>
)

export default Contact
