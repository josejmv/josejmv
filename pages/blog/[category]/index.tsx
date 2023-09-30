// main tools
import Link from 'next/link'

// components
import { BlogLayout } from '@organisms/Blog/layout'
import { BlogCard } from '@organisms/Blog/card'

// bootstrap components
import { Row, Col } from 'react-bootstrap'

// types
import { GetServerSidePropsContext, NextPage } from 'next'
import { PostDataType } from 'types/models/post'
import { GetSSPropsType } from 'types'

const BlogCategoriesPage: NextPage<
  GetSSPropsType<typeof getServerSideProps>
> = ({ category, filteredPostsIds }) => (
  <BlogLayout>
    <Row>
      {filteredPostsIds?.map((post) => (
        <Col sm={6} lg={4} xl={3} key={post.id}>
          <Link href={`/blog/${category}/${post.id}`}>
            <BlogCard {...post} />
          </Link>
        </Col>
      ))}
    </Row>
  </BlogLayout>
)

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { category } = ctx.query
  if (!category)
    return { redirect: { destination: '/', permanent: false }, props: {} }

  const postsJson = await import('@publics/assets/blog/posts/index.json')

  const filteredPostsIds = postsJson.posts.filter(
    (post) => post.category === category
  ) as PostDataType[]

  return { props: { category, filteredPostsIds } }
}

export default BlogCategoriesPage
