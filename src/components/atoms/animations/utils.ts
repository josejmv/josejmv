const duration = 0.8
const initialPosition = 50

export const fadeIn = {
  initial: { opacity: 0 },
  transition: { duration },
  viewport: { once: false },
  whileInView: { opacity: 1 }
}

export const rightToLeft = {
  transition: { duration },
  viewport: { once: false },
  whileInView: { x: 0, opacity: 1 },
  initial: { x: initialPosition, opacity: 0 }
}

export const leftToRight = {
  transition: { duration },
  viewport: { once: false },
  whileInView: { x: 0, opacity: 1 },
  initial: { x: initialPosition * -1, opacity: 0 }
}

export const bottomToTop = {
  transition: { duration },
  viewport: { once: false },
  whileInView: { y: 0, opacity: 1 },
  initial: { y: initialPosition, opacity: 0 }
}

export const topToBottom = {
  transition: { duration },
  viewport: { once: false },
  whileInView: { y: 0, opacity: 1 },
  initial: { y: initialPosition * -1, opacity: 0 }
}
