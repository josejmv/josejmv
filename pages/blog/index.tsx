// components
import { Layout } from 'components/Layout'

// styles
import styles from 'styles/home.module.scss'

// types
import type { FC } from 'react'

const Blog: FC = () => (
  <Layout>
    <div className={styles.container}>
      <h1>Blog en construccion 😀</h1>
    </div>
  </Layout>
)

export default Blog
