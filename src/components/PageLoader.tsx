// bootstrap components
import { Modal, Spinner } from 'react-bootstrap'

// styles
import styles from 'styles/app.module.scss'

// types
import { FC } from 'react'
import { ModalType } from 'types'

export const PageLoader: FC<ModalType> = ({ show, setShow }) => (
  <Modal
    centered
    className={styles.modal}
    contentClassName={styles.content}
    size='sm'
    show={show}
    onHide={setShow}
  >
    <Modal.Body>
      <Spinner animation='grow' variant='primary' />
    </Modal.Body>
  </Modal>
)
