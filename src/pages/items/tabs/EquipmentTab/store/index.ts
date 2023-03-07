import { array, CheckerReturnType, number, object, optional, string } from '@recoiljs/refine'
import { atom } from 'recoil'
import { urlSyncEffect } from 'recoil-sync'

const equipmentSearchRefine = object({
  labels: optional(array(string())),
  name: optional(string()),
  locationNo: optional(number()),
  page: optional(number()),
  size: optional(number()),
})

export type EquipmentSearchType = CheckerReturnType<typeof equipmentSearchRefine>

export const equipmentSearchState = atom({
  key: 'equipmentSearchState',
  default: {
    page: 1,
    size: 7,
  },
  effects: [
    urlSyncEffect({
      refine: equipmentSearchRefine,
      history: 'push',
    }),
  ],
})
