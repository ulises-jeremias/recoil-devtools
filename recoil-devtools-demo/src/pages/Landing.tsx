import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { commonNotification } from 'app/state'

import './Landing.css'

const Landing = () => {
  const [count, setCount] = useState(0)
  const setNotification = useSetRecoilState(commonNotification)

  const handleClick = () => {
    setNotification({
      isVisible: true,
      message: `Hi ${count} !`,
    })
    setCount(count + 1)
  }

  return <button onClick={handleClick}>Click</button>
}

export default Landing
