// main tools
import Image from 'next/image'

// components
import { BlogLayout } from '@organisms/Blog/layout'

// bootstrap components
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

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

  const tooltip = (text: string) => (
    <Tooltip id='button-tooltip' className={classes.tooltip}>
      {text}
    </Tooltip>
  )

  return (
    <BlogLayout>
      <h1 className={classes.title}>{post.title}</h1>
      <div className={classes.content}>
        {post.content !== '' && (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
        {post.assets &&
          post.assets
            .sort((prev, next) => prev.order - next.order)
            .map((asset) => (
              <OverlayTrigger
                key={asset.url}
                placement='bottom'
                overlay={tooltip(asset.tooltip || '')}
                show={asset.tooltip ? undefined : false}>
                <div className={classes.content_assets}>
                  <Image
                    alt='image'
                    layout='fill'
                    quality={100}
                    src={asset.url}
                    className={classes.content_assets_image}
                  />
                </div>
              </OverlayTrigger>
            ))}
      </div>
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
