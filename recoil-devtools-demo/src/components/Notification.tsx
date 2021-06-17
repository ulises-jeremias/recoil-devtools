import React from 'react'
import { useRecoilValue } from 'recoil'
import { commonNotification } from 'state'
import { Message } from 'components/Message'

// Notification provider
const Notification = () => {
  const notification = useRecoilValue(commonNotification)

  const { title, message, initialized } = notification

  if (!initialized) {
    return null
  }

  return (
    <Message>
      <strong>{title}</strong> {message}
    </Message>
  )
}

export default Notification
