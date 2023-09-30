// main tools
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

// components
import { LoginForm } from './form'

// bootstrap components
import {
  Modal,
  Button,
  Tooltip,
  Spinner,
  CloseButton,
  OverlayTrigger
} from 'react-bootstrap'
import { Lock, Unlock } from 'react-bootstrap-icons'

// styles
import classes from './styles.module.scss'

// types
import { FC } from 'react'

export const LoginModal: FC = () => {
  const { push } = useRouter()
  const { data: session, status } = useSession()
  const [showLogin, setShowLogin] = useState(false)

  const handleShowLogin = () => setShowLogin((prev) => !prev)
  const handleGoToDashboard = () =>
    push(`${session?.redirection.url!}?secret=${session?.redirection.secret}`)

  const handleAction = session ? handleGoToDashboard : handleShowLogin

  const loginTooltip = (
    <Tooltip>{session ? 'Dashboard' : 'Iniciar sesión'}</Tooltip>
  )

  return (
    <>
      {status === 'loading' ? (
        <Spinner animation='grow' />
      ) : (
        <OverlayTrigger placement='top' overlay={loginTooltip}>
          <Button onClick={handleAction} className={classes.button}>
            {session ? <Unlock size={30} /> : <Lock size={30} />}
          </Button>
        </OverlayTrigger>
      )}

      <Modal
        centered
        keyboard={false}
        show={showLogin}
        backdrop='static'
        className={classes.modal}
        onHide={handleShowLogin}>
        <Modal.Body className={classes.modal_body}>
          <CloseButton onClick={handleShowLogin} />
          <LoginForm handleShowLogin={handleShowLogin} />
        </Modal.Body>
      </Modal>
    </>
  )
}
