import { atom, selector } from 'recoil'

interface NotificationState {
  title: string
  message: string
  initialized?: boolean
}

// notifications management
export const commonNotificationState = atom({
  key: 'commonNotificationState',
  default: {
    title: '',
    message: '',
  },
})

export const notificationsCounter = atom({
  key: 'notificationsCounter',
  default: 0,
})

export const commonNotification = selector<NotificationState>({
  key: 'commonNotification',
  get: ({ get }) => {
    const { title, message } = get(commonNotificationState)
    const count = get(notificationsCounter)

    return {
      initialized: count > 0,
      title: `Notification #${count} - ${title}`,
      message,
    }
  },
  set: ({ get, set }, newValue) => {
    set(commonNotificationState, newValue)
    set(notificationsCounter, get(notificationsCounter) + 1)
  },
})

export default { commonNotification }
