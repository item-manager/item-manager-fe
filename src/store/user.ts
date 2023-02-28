import { LoginUserRS } from '@/apis'
import { atom, selector } from 'recoil'

export const userState = atom<LoginUserRS | null>({ key: 'userState', default: null })

export const isLoggedInState = selector({
  key: 'isLoggedIn',
  get: ({ get }) => {
    const user = get(userState)

    return !!user
  },
})
