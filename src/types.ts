// types
import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react'

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

export interface InputChange extends ChangeEvent<HTMLInputElement> {}
export interface FormSubmit extends FormEvent<HTMLFormElement> {}
