import { atom, AtomEffect, DefaultValue } from 'recoil'

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: Parameters<AtomEffect<boolean>>[0]) => {
    const savedValue = localStorage.getItem(key)
    if (savedValue !== null) {
      setSelf(JSON.parse(savedValue))
    }
    onSet((newValue: boolean, _oldValue: boolean | DefaultValue, isReset: boolean) => {
      isReset ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(newValue))
    })
  }

export const isSideCollapsedState = atom({
  key: 'isSideCollapsedState',
  default: false,
  effects: [localStorageEffect('isSideCollapsedState')],
})

export const drawerOpenState = atom({ key: 'drawerOpen', default: false })
