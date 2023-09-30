// main tools
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// prime components
import { Skeleton } from 'primereact/skeleton'

// bootstrap components
import { Col, Container, Row } from 'react-bootstrap'

// styles
import classes from './styles.module.scss'

// types
import { PostDataType } from 'types/models/post'
import { FC } from 'react'

export const SidebarItem: FC<PostDataType> = (props) => {
  const [post, setPost] = useState<PostDataType>()

  useEffect(() => {
    ;(async () => {
      const postJson = await import(
        `@publics/assets/blog/posts/${props.category}/${props.id}.json`
      )

      setPost(postJson.default)
    })()
  })

  if (!post) return <Skeleton width='100%' height='2rem' />

  return (
    <Container role='button' className={classes.item}>
      <Link href={`/blog/${props.category}/${props.id}`}>
        <Row>
          <Col xs={3}>
            <Image
              width={45}
              height={45}
              alt={post.title}
              src={post.picture}
              className={classes.img}
            />
          </Col>
          <Col xs={9}>
            <span className={classes.small}>{post.title}</span>
          </Col>
        </Row>
      </Link>
    </Container>
  )
}
