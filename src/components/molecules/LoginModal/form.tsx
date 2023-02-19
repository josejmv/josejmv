// main tools
import { useState } from 'react'
import { signIn } from 'next-auth/react'

// bootstrap components
import { Button, Spinner } from 'react-bootstrap'

// prime components
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'

// hooks
import { useApp } from 'hooks/useApp'

// styles
import classes from 'styles/components/loginModal/form.module.scss'

// types
import { ChangeType, SubmitType } from 'types'
import { FC } from 'react'

type LoginFormProps = { handleShowLogin: () => void }

export const LoginForm: FC<LoginFormProps> = ({ handleShowLogin }) => {
  const { toast } = useApp()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUsernameChanges = (ev: ChangeType) => setUsername(ev.target.value)
  const handlePasswordChanges = (ev: ChangeType) => setPassword(ev.target.value)

  const handleSubmit = async (ev: SubmitType) => {
    ev.preventDefault()
    setLoading(true)

    const data = await signIn<any>('credentials', {
      username,
      password,
      redirect: false
    })

    if (data?.error) {
      toast()?.show({ summary: 'Error', severity: 'error', detail: data.error })
    } else {
      handleShowLogin()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className={classes.login}>
      <span className={classes.title}>Iniciar sesión</span>

      <label htmlFor='username' className={classes.small}>
        Usuario
      </label>
      <InputText
        required
        id='username'
        value={username}
        className={classes.input}
        placeholder='Nombre de usuario'
        onChange={handleUsernameChanges}
      />

      <label htmlFor='password' className={classes.small}>
        Contraseña
      </label>
      <Password
        required
        toggleMask
        feedback={false}
        value={password}
        inputId='password'
        placeholder='*********'
        className={classes.password}
        onChange={handlePasswordChanges}
      />

      <Button type='submit' className={classes.button}>
        {loading ? <Spinner animation='border' size='sm' /> : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
