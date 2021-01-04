import { atom } from 'recoil'

// notification
export const commonNotification = atom({
  key: 'commonNotification',
  default: {
    isVisible: false,
    message: '',
  },
})

export default { commonNotification }
