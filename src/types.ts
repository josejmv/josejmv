// types
import type { Dispatch, SetStateAction } from 'react'

export type NavbarType = {
  title?: string
  navbarAttributes?: navbarAttributesType
}

export type navbarAttributesType = {
  bg: string
  sticky?: 'top'
  fixed?: 'top' | 'bottom'
}

export type ModalType = {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
}

export type NextButtonType = {
  href: string
  text?: string
  variant?: string
}
