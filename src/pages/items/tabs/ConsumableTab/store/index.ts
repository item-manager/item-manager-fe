import {
  array,
  CheckerReturnType,
  literal,
  number,
  object,
  optional,
  string,
  union,
} from '@recoiljs/refine'
import { atom } from 'recoil'
import { urlSyncEffect } from 'recoil-sync'

const consumableSearchRefine = object({
  labels: optional(array(string())),
  name: optional(string()),
  orderBy: optional(
    union(
      literal('PRIORITY'),
      literal('QUANTITY'),
      literal('LATEST_PURCHASE_DATE'),
      literal('LATEST_CONSUME_DATE')
    )
  ),
  sort: optional(union(literal('+'), literal('-'))),
  page: optional(number()),
  size: optional(number()),
})

export type ConsumableSearchType = CheckerReturnType<typeof consumableSearchRefine>

export const consumableSearchState = atom({
  key: 'consumableSearchState',
  default: {
    sort: '+',
    page: 1,
    size: 8,
  },
  effects: [
    urlSyncEffect({
      refine: consumableSearchRefine,
      history: 'push',
    }),
  ],
})
