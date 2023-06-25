import { ConsumableItemRS, httpClient } from '@/apis'
import { DeleteFilled, EllipsisOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Modal, message, Tooltip } from 'antd'
import useModal from '@/hooks/useModal'

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

const deleteItem = async (record: ConsumableItemRS) => {
  Modal.confirm({
    title: `물품 삭제`,
    content: (
      <>
        해당 물품(<b>{record.name}</b>)을 삭제하시겠습니까?
      </>
    ),
    onOk: async () => {
      await httpClient.items.deleteItem(record.itemNo)
      // queryClient.invalidateQueries({ queryKey: ['items'] })
      message.success('삭제되었습니다.')
    },
  })
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
  {
    title: <EllipsisOutlined />,
    key: '...',
    align: 'center',
    render(record: any) {
      return (
        <Tooltip title='삭제'>
          <Button
            type='text'
            shape='circle'
            icon={<DeleteFilled className='text-stone-500' />}
            className='flex items-center justify-center py-0 mx-auto'
            onClick={(e) => {
              e.stopPropagation()
              deleteItem(record)
            }}
          />
        </Tooltip>
      )
    },
    width: 70,
  },
]
