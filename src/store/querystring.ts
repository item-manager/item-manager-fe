import { array, literal, nullable, number, string, union } from '@recoiljs/refine'
import { atom, DefaultValue, selector } from 'recoil'
import { urlSyncEffect } from 'recoil-sync'

export const currentTabKeyState = atom({
  key: 'currentTabKey',
  default: null,
  effects: [urlSyncEffect({ refine: nullable(string()), history: 'push' })],
})

export const labelsState = atom({
  key: 'labels',
  default: [],
  effects: [urlSyncEffect({ refine: nullable(array(string())), history: 'push' })],
})

export const nameState = atom({
  key: 'name',
  default: null,
  effects: [urlSyncEffect({ refine: nullable(string()), history: 'push' })],
})

export const orderByState = atom({
  key: 'orderBy',
  default: null,
  effects: [
    urlSyncEffect({
      refine: nullable(
        union(
          literal('priority'),
          literal('quantity'),
          literal('latest_purchase_date'),
          literal('latest_consume_date')
        )
      ),
      history: 'push',
    }),
  ],
})

export const sortState = atom({
  key: 'sort',
  default: null,
  effects: [
    urlSyncEffect({ refine: nullable(union(literal('+'), literal('-'))), history: 'push' }),
  ],
})

export const pageState = atom({
  key: 'page',
  default: 1,
  effects: [urlSyncEffect({ refine: number(), history: 'push' })],
})

export const sizeState = atom({
  key: 'size',
  default: 7,
  effects: [urlSyncEffect({ refine: number(), history: 'push' })],
})

export const locationNoState = atom({
  key: 'locationNo',
  default: null,
  effects: [urlSyncEffect({ refine: nullable(number()), history: 'push' })],
})

export const allSearchState = selector({
  key: 'allSearchState',
  get: ({ get }) => {
    const labels = get(labelsState)
    const name = get(nameState)
    const orderBy = get(orderByState)
    const sort = get(sortState)
    const page = get(pageState)
    const size = get(sizeState)
    const locationNo = get(locationNoState)

    return {
      labels,
      name,
      orderBy,
      sort,
      page,
      size,
      locationNo,
    }
  },
  set: ({ reset }) => {
    reset(labelsState)
    reset(nameState)
    reset(orderByState)
    reset(sortState)
    reset(pageState)
    reset(sizeState)
    reset(locationNoState)
  },
})

export const consumableSearchState = selector({
  key: 'consumableSearchState',
  get: ({ get }) => {
    const labels = get(labelsState)
    const name = get(nameState)
    const orderBy = get(orderByState)
    const sort = get(sortState)
    const page = get(pageState)
    const size = get(sizeState)

    return {
      labels,
      name,
      orderBy,
      sort,
      page,
      size,
    }
  },
  set: ({ set, reset }, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(labelsState)
      reset(nameState)
      reset(orderByState)
      reset(sortState)
      reset(pageState)
      reset(sizeState)
    } else {
      set(labelsState, newValue.labels || [])
      set(nameState, newValue.name || null)
      set(orderByState, newValue.orderBy || null)
      set(sortState, newValue.sort || null)
      set(pageState, newValue.page)
      set(sizeState, newValue.size)
    }
  },
})

export const equipmentSearchState = selector({
  key: 'equipmentSearchState',
  get: ({ get }) => {
    const labels = get(labelsState)
    const name = get(nameState)
    const locationNo = get(locationNoState)
    const page = get(pageState)
    const size = get(sizeState)

    return {
      labels,
      name,
      locationNo,
      page,
      size,
    }
  },
  set: ({ set, reset }, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(labelsState)
      reset(nameState)
      reset(locationNoState)
      reset(pageState)
      reset(sizeState)
    } else {
      set(labelsState, newValue.labels || [])
      set(nameState, newValue.name || null)
      set(locationNoState, newValue.locationNo || null)
      set(pageState, newValue.page)
      set(sizeState, newValue.size)
    }
  },
})
