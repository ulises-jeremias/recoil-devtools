import { atom } from 'recoil'

// notifications management
export const commonNotification = atom({
  key: 'commonNotification',
  default: {
    title: '',
    message: '',
  },
})

export default { commonNotification }
