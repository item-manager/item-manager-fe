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

export const orderByType = atom({
  key: 'orderByType',
  default: null,
  effects: [
    urlSyncEffect({
      refine: nullable(union(literal('date'), literal('count'), literal('price'), literal('null'))),
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
  default: 20,
  effects: [urlSyncEffect({ refine: number(), history: 'push' })],
})

export const locationNoState = atom({
  key: 'locationNo',
  default: null,
  effects: [urlSyncEffect({ refine: nullable(number()), history: 'push' })],
})

export const itemNoState = atom({
  key: 'itemNo',
  default: null,
  effects: [urlSyncEffect({ refine: nullable(number()), history: 'push' })],
})

export const typeState = atom({
  key: 'type',
  default: null,
  effects: [urlSyncEffect({ refine: nullable(string()), history: 'push' })],
})

export const yearState = atom({
  key: 'year',
  default: null,
  effects: [
    urlSyncEffect({
      refine: nullable(
        union(
          literal(2023),
          literal(2022),
          literal(2021),
          literal(2020),
          literal(2019),
          literal(2018),
          literal(2017),
          literal(2016),
          literal(2015),
          literal(2014),
          literal(2013),
          literal(2012),
          literal(2011),
          literal(2010),
          literal(2009),
          literal(2008),
          literal(2007),
          literal(2006),
          literal(2005),
          literal(2004),
          literal(2003)
        )
      ),
      history: 'push',
    }),
  ],
})

export const monthState = atom({
  key: 'month',
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

export const quantityLogState = selector({
  key: 'quantityLogState',
  get: ({ get }) => {
    const itemNo = get(itemNoState)
    const type = get(typeState)
    const year = get(yearState)
    const month = get(monthState)
    const orderBy = get(orderByType)
    const sort = get(sortState)
    const page = get(pageState)
    const size = get(sizeState)

    return {
      itemNo,
      type,
      year,
      month,
      orderBy,
      sort,
      page,
      size,
    }
  },
  set: ({ set, reset }, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(itemNoState)
      reset(typeState)
      reset(yearState)
      reset(monthState)
      reset(orderByType)
      reset(sortState)
      reset(pageState)
      reset(sizeState)
    } else {
      set(itemNoState, newValue.itemNo || null)
      set(typeState, newValue.type || null)
      set(yearState, newValue.year || null)
      set(monthState, newValue.month || null)
      set(orderByType, newValue.orderBy || null)
      set(sortState, newValue.sort || null)
      set(pageState, newValue.page)
      set(sizeState, newValue.size)
    }
  },
})
