export const PurchaseStatus = (status: string) => {
  switch (status) {
    case 'PURCHASE':
      return '구매'
    case 'CONSUME':
      return '사용'
    default:
      return ''
  }
}

export const columns: any = [
  {
    title: '구매/사용',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    width: 200,
    render(value: string, record: { type: string }) {
      return PurchaseStatus(record.type)
    },
  },
  {
    title: '일자',
    dataIndex: 'date',
    key: 'date',
    align: 'center',
    width: 200,
    render(value: string) {
      return value.split('T')[0]
    },
  },
  {
    title: '수량',
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'center',
    width: 80,
    render(value: number, record: { count: number }) {
      return record.count
    },
  },
  {
    title: '단위금액',
    dataIndex: 'amount',
    key: 'amount',
    align: 'center',
    width: 200,
    render(value: number, record: { price: number }) {
      return record.price ? record.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null
    },
  },
  {
    title: '구매처',
    dataIndex: 'buyer',
    key: 'buyer',
    align: 'center',
    width: 200,
    render(value: string, record: { mall: string }) {
      return record.mall
    },
  },
]
