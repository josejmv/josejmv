// main tools
import { useState, useEffect } from 'react'

// bootstrap components
import { Card as BsCard } from 'react-bootstrap'

// prime react
import { Skeleton } from 'primereact/skeleton'

// styles
import classes from './styles.module.scss'

// main tools
import { PostDataType } from 'types/models/post'
import { FC } from 'react'

export const BlogCard: FC<PostDataType> = (props) => {
  const [article, setArticle] = useState<PostDataType>()

  useEffect(() => {
    ;(async () => {
      const data = await import(
        `@publics/assets/blog/posts/${props.category}/${props.id}.json`
      )

      setArticle(data.default)
    })()
  }, [props])

  if (!article) return <Skeleton width='100%' height='250px' />

  return (
    <BsCard role='button' className={classes.card}>
      <BsCard.Img
        alt={article.title}
        src={article.picture}
        className={classes.card_img}
      />
      <BsCard.ImgOverlay className={classes.card_overlay}>
        <BsCard.Footer className={classes.card_footer}>
          <BsCard.Title className={classes.card_title}>
            {article.title}
          </BsCard.Title>
        </BsCard.Footer>
      </BsCard.ImgOverlay>
    </BsCard>
  )
}
