import { atom } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

export const showPassword = atom({
  key: `isShow/${uuidv4()}`,
  default: false,
})

export const showPasswordConfirm = atom({
  key: `isShowPass/${uuidv4()}`,
  default: false,
})

export const ascendYear = atom({
  key: `isAcendYear/${uuidv4()}`,
  default: false,
})

export const ascendMonth = atom({
  key: `isAcendMonth/${uuidv4()}`,
  default: false,
})

export const ascendAmount = atom({
  key: `isAcendAmount/${uuidv4()}`,
  default: false,
})
