import { bottomToTop } from '@atoms/animations/utils'
import { topToBottom } from '@atoms/animations/utils'

export const animations = {
  iconsAnimation: {
    ...topToBottom,
    transition: { ...topToBottom.transition, delay: 0.3 }
  },
  textsAnimation: {
    ...bottomToTop,
    transition: { ...bottomToTop.transition, delay: 0.6 }
  }
}
