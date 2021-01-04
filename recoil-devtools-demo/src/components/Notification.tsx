import React from 'react'
import { useRecoilState } from 'recoil'

import { commonNotification } from 'app/state'

// Notification provider
const Notification = () => {
  const [notification, setNotification] = useRecoilState(commonNotification)

  // on notification hide
  const onDismiss = () =>
    setNotification((previous) => ({
      ...previous,
      isVisible: false,
    }))

  if (notification.isVisible) {
    return <div>{notification.message}</div>
  }

  return null
}

export default Notification
