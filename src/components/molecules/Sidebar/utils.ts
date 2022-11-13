import { leftToRight, bottomToTop } from '@atoms/animations/utils'

export const animations = {
  anchors: (idx: number) => ({
    ...leftToRight,
    transition: { ...leftToRight.transition, delay: idx / 3 }
  }),
  actions: {
    ...bottomToTop,
    transition: { ...leftToRight.transition, delay: 0.8 }
  }
}
