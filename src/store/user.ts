import { UserRS } from '@/apis'
import { atom, selector } from 'recoil'

export const userState = atom<UserRS | null>({ key: 'userState', default: null })

export const isLoggedInState = selector({
  key: 'isLoggedIn',
  get: ({ get }) => {
    const user = get(userState)

    return !!user
  },
})
