import React, { FC } from 'react'
import { RecoilLogger } from 'recoil-devtools-logger'
import RecoilLogMonitor from 'recoil-devtools-log-monitor'

export const Devtools = () => {
  return (
    <>
      <RecoilLogger />
      <RecoilLogMonitor />
    </>
  )
}
