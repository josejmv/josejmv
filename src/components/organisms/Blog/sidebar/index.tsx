// main tools
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// prime components
import { Divider } from 'primereact/divider'

// components
import { SidebarItem } from './item'

// bootstrap components
import { Container, Row, Col } from 'react-bootstrap'

// styles
import classes from './styles.module.scss'

// types
import { PostDataType } from 'types/models/post'
import { FC } from 'react'

export const BlogSidebar: FC = () => {
  const { query } = useRouter()
  const [posts, setPosts] = useState<PostDataType[]>()

  useEffect(() => {
    ;(async () => {
      const postsJson = await import('@publics/assets/blog/posts/index.json')

      const filteredPostsIds = postsJson.default.posts.filter(
        (post) =>
          post.category === query.category && post.id !== Number(query.id)
      ) as PostDataType[]

      setPosts(filteredPostsIds)
    })()
  }, [query])

  return (
    <aside className={classes.aside}>
      <h2 className={classes.title}>recomendado</h2>
      <Divider layout='horizontal' className={classes.divider} />

      <Container>
        <Row>
          {posts &&
            posts.map((post) => (
              <Col xs={12} key={post.id}>
                <SidebarItem {...post} />
              </Col>
            ))}
        </Row>
      </Container>
    </aside>
  )
}
