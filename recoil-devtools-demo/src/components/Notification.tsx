import React from 'react'
import { useRecoilValue } from 'recoil'
import { commonNotification } from 'app/state'
import { Message } from 'app/components/Message'

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
