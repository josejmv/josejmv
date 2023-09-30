// components
import { BlogLayout } from '@organisms/Blog/layout'

// styles
import classes from 'styles/pages/blog/post/styles.module.scss'

// types
import { GetServerSidePropsContext, NextPage } from 'next'
import { PostDataType } from 'types/models/post'
import { GetSSPropsType } from 'types'

const BlogCategoryPage: NextPage<GetSSPropsType<typeof getServerSideProps>> = ({
  post
}) => {
  if (!post) return null

  return (
    <BlogLayout>
      <h1 className={classes.title}>{post.title}</h1>
      <div
        className={classes.content}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </BlogLayout>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id, category } = ctx.query
  if (!category && !id)
    return { redirect: { destination: '/', permanent: false }, props: {} }
  if (!id && category)
    return {
      redirect: { destination: `/blog/${category}`, permanent: false },
      props: {}
    }

  const post = await import(`@publics/assets/blog/posts/${category}/${id}.json`)

  return { props: { post: post.default as PostDataType } }
}

export default BlogCategoryPage
