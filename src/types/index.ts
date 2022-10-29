import { FormEvent, ChangeEvent, SetStateAction, Dispatch } from 'react'
import { GetServerSideProps } from 'next'

export interface ChangeType extends ChangeEvent<HTMLInputElement> {}
export interface SubmitType extends FormEvent<HTMLFormElement> {}
export type SetStateType<objectType> = Dispatch<SetStateAction<objectType>>
export type GetSSPropsType<PropsType> = PropsType extends GetServerSideProps<
  infer Props,
  any
>
  ? Props
  : PropsType
