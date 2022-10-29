// main tools
import { useState } from 'react'

// components
import { Sidebar } from '@molecules/Sidebar'

// bootstrap components
import { Offcanvas, Container, Button } from 'react-bootstrap'

// styles
import classes from 'styles/components/navbar/styles.module.scss'

// types
import { FC } from 'react'

export const Navbar: FC = () => {
  const [showSidebar, setShowSidebar] = useState(false)

  /**
   * handle show/hide sidebar
   */
  const handleShowSidebar = () => setShowSidebar(!showSidebar)

  return (
    <Container className={classes.navbar}>
      <div className={classes.navbar_header}>
        <h2 className={classes.title}>Portfolio</h2>

        <Button onClick={handleShowSidebar} className={classes.toggle}>
          <div></div>
        </Button>
      </div>

      <Offcanvas show={showSidebar} onHide={handleShowSidebar}>
        <Offcanvas.Header className={classes.offcanvas_header} closeButton />
        <Sidebar handleShowSidebar={handleShowSidebar} />
      </Offcanvas>
    </Container>
  )
}
