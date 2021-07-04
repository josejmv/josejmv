// components
import { Layout } from 'components/Layout'
import * as PROGRESS from 'components/pages/home'

// types
import type { FC } from 'react'

const Progress: FC = () => (
  <Layout title='Progress'>
    <PROGRESS.Platzi />
    <PROGRESS.SeoContenidos />
    <PROGRESS.Centria />
  </Layout>
)

export default Progress
