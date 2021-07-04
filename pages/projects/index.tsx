// components
import { Layout } from 'components/Layout'

// styles
import styles from 'styles/home.module.scss'

// types
import type { FC } from 'react'

const Projects: FC = () => (
  <Layout>
    <div className={styles.container}>
      <h1>Proyectos 😀</h1>
    </div>
  </Layout>
)

export default Projects
