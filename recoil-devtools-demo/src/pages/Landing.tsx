import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { commonNotification } from 'app/state'
import { FormGroup, Label, Input } from 'app/components/Form'

import './Landing.css'

const Landing = () => {
  const [title, setTitle] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const setNotification = useSetRecoilState(commonNotification)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSubmit = () => {
    setNotification({
      title,
      message,
    })
    setTitle('')
    setMessage('')
  }

  return (
    <>
      <FormGroup>
        <Label htmlFor="title">Title</Label>
        <Input value={title} onChange={handleTitleChange} id="title" />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="message">Message</Label>
        <Input value={message} onChange={handleMessageChange} id="message" />
      </FormGroup>
      This is a simple butter toast example. <button onClick={handleSubmit}>ClickMe</button>
    </>
  )
}

export default Landing
