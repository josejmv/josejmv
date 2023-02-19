// components
import { Template } from '@organisms/Blog/Layouts/template'

// bootstrap components
import { Spinner } from 'react-bootstrap'

// types
import { GetServerSidePropsContext, NextPage } from 'next'
import { GetSSPropsType } from 'types'

const BlogCategoryPage: NextPage<GetSSPropsType<typeof getServerSideProps>> = ({
  category,
  filteredPosts
}) => {
  console.log(category, filteredPosts)

  return (
    <Template>
      <Spinner animation='grow' />
    </Template>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { category } = ctx.query
  if (!category)
    return { redirect: { destination: '/', permanent: false }, props: {} }

  const rowPosts = await import('@publics/assets/blog/posts.json')

  const filteredPosts = rowPosts.posts.filter(
    (post) => post.category === category
  )

  return { props: { category, filteredPosts } }
}

export default BlogCategoryPage
