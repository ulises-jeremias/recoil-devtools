import { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { commonNotification } from 'app/state'
import { useInterval } from 'app/hooks/interval'

import './Landing.css'

const Landing = () => {
  const [count, setCount] = useState(0)
  const setNotification = useSetRecoilState(commonNotification)

  useInterval(() => {
    setNotification({
      isVisible: true,
      message: `Hi ${count} !`,
    })
    setCount(count + 1)
  }, 5000)

  return null
}

export default Landing
