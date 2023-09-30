// bootstrap components
import { Card as BsCard } from 'react-bootstrap'

// styles
import classes from './styles.module.scss'

// main tools
import { FC } from 'react'

type CardProps = {
  name: string
  picture: string
}

export const GenericCard: FC<CardProps> = (props) => (
  <BsCard role='button' className={classes.card}>
    <BsCard.Img
      alt={props.name}
      src={props.picture}
      className={classes.card_img}
    />
    <BsCard.ImgOverlay className={classes.card_overlay}>
      <BsCard.Footer className={classes.card_footer}>
        <BsCard.Title className={classes.card_title}>{props.name}</BsCard.Title>
      </BsCard.Footer>
    </BsCard.ImgOverlay>
  </BsCard>
)
