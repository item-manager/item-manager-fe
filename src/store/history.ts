import { atom } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

export const historyTab = atom({
  key: `isHistory/${uuidv4()}`,
  default: false,
})
