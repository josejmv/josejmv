// next components
import Link from 'next/link'

// bootstrap components
import { Button } from 'react-bootstrap'
import { ChevronDoubleRight } from 'react-bootstrap-icons'

// styles
import styles from 'styles/components/atoms/nextbutton.module.scss'

// types
import type { FC } from 'react'
import type { NextButtonType } from 'types'

export const NextRight: FC<NextButtonType> = ({
  href,
  variant = 'light',
  children,
}) => (
  <Link passHref href={href}>
    <Button
      as='a'
      className={styles.button}
      variant={`outline-${variant}`}
      size='lg'
    >
      {children} <ChevronDoubleRight className={styles.button_icon} />
    </Button>
  </Link>
)
