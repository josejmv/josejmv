// components
import { Layout } from 'components/Layout'
import * as PAGE from 'components/pages/home'

// types
import type { FC } from 'react'

const Progress: FC = () => (
  <Layout title='Progress'>
    <PAGE.Platzi />
    <PAGE.SeoContenidos />
    <PAGE.Centria />
  </Layout>
)

export default Progress
