import React, { FC } from 'react'
import { RecoilLogger } from 'recoil-devtools-logger'
import LogMonitor from 'recoil-devtools-log-monitor'
import DockMonitor from 'recoil-devtools-dock'

export const Devtools = () => {
  return (
    <>
      <RecoilLogger />
      <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q" changeMonitorKey="ctrl-m">
        <LogMonitor />
      </DockMonitor>
    </>
  )
}
