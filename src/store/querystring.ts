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
  default: null,
  effects: [urlSyncEffect({ refine: nullable(number()), history: 'push' })],
})

export const sizeState = atom({
  key: 'size',
  default: null,
  effects: [urlSyncEffect({ refine: nullable(number()), history: 'push' })],
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
  set: ({ set }, newValue) => {
    // if (!(newValue instanceof DefaultValue)) {
    //   set(labelsState, newValue.labels || null)
    //   set(nameState, newValue.name || null)
    //   set(orderByState, newValue.orderBy || null)
    //   set(sortState, newValue.sort || null)
    //   set(pageState, newValue.page || null)
    //   set(sizeState, newValue.size || null)
    // } else {
    // TODO 타입 체킹 하는 방법?
    // @ts-ignore
    set(labelsState, newValue.labels || [])
    // @ts-ignore
    set(nameState, newValue.name || null)
    // @ts-ignore
    set(orderByState, newValue.orderBy || null)
    // @ts-ignore
    set(sortState, newValue.sort || null)
    // @ts-ignore
    set(pageState, newValue.page || null)
    // @ts-ignore
    set(sizeState, newValue.size || null)
    // @ts-ignore
    set(locationNoState, newValue.locationNo || null)
    // }
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
  set: ({ set }, newValue) => {
    // if (!(newValue instanceof DefaultValue)) {
    //   set(labelsState, newValue.labels || null)
    //   set(nameState, newValue.name || null)
    //   set(orderByState, newValue.orderBy || null)
    //   set(sortState, newValue.sort || null)
    //   set(pageState, newValue.page || null)
    //   set(sizeState, newValue.size || null)
    // } else {
    // TODO 타입 체킹 하는 방법?
    // @ts-ignore
    set(labelsState, newValue.labels || [])
    // @ts-ignore
    set(nameState, newValue.name || null)
    // @ts-ignore
    set(orderByState, newValue.orderBy || null)
    // @ts-ignore
    set(sortState, newValue.sort || null)
    // @ts-ignore
    set(pageState, newValue.page || null)
    // @ts-ignore
    set(sizeState, newValue.size || null)
    // }
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
  set: ({ set }, newValue) => {
    // if (!(newValue instanceof DefaultValue)) {
    // TODO 타입 체킹 하는 방법?
    // @ts-ignore
    set(labelsState, newValue.labels || [])
    // @ts-ignore
    set(nameState, newValue.name || null)
    // @ts-ignore
    set(locationNoState, newValue.locationNo || null)
    // @ts-ignore
    set(pageState, newValue.page || null)
    // @ts-ignore
    set(sizeState, newValue.size || null)
    // }
  },
})
