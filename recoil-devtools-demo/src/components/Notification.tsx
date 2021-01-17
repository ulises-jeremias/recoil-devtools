import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import ButterToast, { Cinnamon, POS_TOP, POS_LEFT } from 'butter-toast'
import { commonNotification } from 'app/state'

// Notification provider
const Notification = () => {
  const notification = useRecoilValue(commonNotification)

  useEffect(() => {
    ButterToast.raise({
      content: (
        <Cinnamon.Crisp
          scheme={Cinnamon.Crisp.SCHEME_BLUE}
          content={() => <div>{notification.message}</div>}
          title={notification.title}
        />
      ),
    })
  }, [notification])

  const position = {
    vertical: POS_TOP,
    horizontal: POS_LEFT,
  }

  return <ButterToast position={position} />
}

export default Notification
