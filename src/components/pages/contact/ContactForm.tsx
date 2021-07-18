// main tools
import { useState, useEffect } from 'react'

// bootstrap components
import { Form, Button, Spinner } from 'react-bootstrap'

// type
import type { FC } from 'react'
import type { InputChange, FormSubmit } from 'types'

export const ContactForm: FC = () => {
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({ name: '', message: '' })

  const formatText = (text: string) => text.replaceAll(' ', '%20')

  const handleChange = (ev: InputChange) => {
    validated && setValidated(false)
    setData({ ...data, [ev.target.name]: ev.target.value })
  }

  const handleSubmit = (event: FormSubmit) => {
    event.preventDefault()
    !validated && setValidated(true)
    if (event.currentTarget.checkValidity()) setLoading(true)
  }

  /**
   * delete when email process is finished
   */
  useEffect(() => {
    let timeout = null
    if (loading)
      timeout = setTimeout(() => {
        window.open(
          `https://wa.me/+584147545160?text=Nombre:%20${formatText(
            data.name
          )}%0A%0AMessage:%20${formatText(data.message)}`,
          '_blank'
        )
        setLoading(false)
      }, 1000)

    return () => clearTimeout(timeout)
  }, [loading])

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h2>Escribeme!</h2>
      <Form.Group>
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          required
          value={data.name}
          onChange={handleChange}
          name='name'
        />
        <Form.Control.Feedback type='invalid'>
          Por favor ingrese un nombre
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Mensaje</Form.Label>
        <Form.Control
          required
          name='message'
          as='textarea'
          rows={5}
          value={data.message}
          onChange={handleChange}
        />
        <Form.Control.Feedback type='invalid'>
          Por favor ingrese un mensaje
        </Form.Control.Feedback>
      </Form.Group>
      <Button disabled={loading} block type='submit'>
        {loading ? <Spinner animation='border' /> : 'Enviar Whatsapp'}
      </Button>
    </Form>
  )
}
