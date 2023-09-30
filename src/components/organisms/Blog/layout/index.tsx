// components
import { BlogSidebar } from '@organisms/Blog/sidebar'
import { BlogNavbar } from '@organisms/Blog/navbar'
import { Footer } from '@molecules/Footer'

// bootstrap components
import { Container, Row, Col } from 'react-bootstrap'

// types
import { FC, ReactNode } from 'react'

type LayoutProps = {
  children?: ReactNode
}

export const BlogLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <BlogNavbar />
      <Container className='my-5 px-4 px-md-2'>
        <Row>
          <Col xs={12} md={7} lg={8} xl={9}>
            {children}
          </Col>
          <Col className='d-none d-md-block' md={5} lg={4} xl={3}>
            <BlogSidebar />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  )
}
