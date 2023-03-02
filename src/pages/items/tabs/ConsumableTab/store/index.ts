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
  currentTabKey: optional(string()),
  labels: optional(array(string())),
  name: optional(string()),
  orderBy: optional(
    union(
      literal('priority'),
      literal('quantity'),
      literal('latest_purchase_date'),
      literal('latest_consume_date')
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
    currentTabKey: '0',
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
