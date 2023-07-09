import { httpClient } from '@/apis'
import { PriorityProgressBar } from '@/components/progress'
import { historyTab } from '@/store/history'
import { useQuery } from '@tanstack/react-query'
import { Space, Tabs, TabsProps, Typography } from 'antd'
import { useParams } from 'react-router'
import { useRecoilState } from 'recoil'
import ItemDetail from './components/itemDetail'
import ItemHistory from './components/itemHistory'

const DetailPage = () => {
  const { itemNo } = useParams()

  const { data: itemDetail } = useQuery(['items'], () => httpClient.items.getItem(Number(itemNo)))

  const [isHistory, setIsHistory] = useRecoilState(historyTab)

  const Detail = () => {
    return (
      <Space wrap size={14} className='mb-2'>
        <Typography.Title level={2} className='flex items-center m-0'>
          <div className='w-6 mr-2'>
            <PriorityProgressBar priority={itemDetail?.data?.priority} strokeWidth={4} />
          </div>
          {itemDetail?.data?.name}
        </Typography.Title>
      </Space>
    )
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `상세정보`,
      children: <ItemDetail />,
    },
    {
      key: '2',
      label: `구매/사용기록`,
      children: <ItemHistory />,
    },
  ]

  const onChangeIsHistory = () => {
    setIsHistory((prev) => !prev)
  }

  return (
    <>
      <Detail />
      <Tabs
        activeKey={isHistory ? '2' : '1'}
        defaultActiveKey='1'
        items={items}
        onChange={onChangeIsHistory}
      />
    </>
  )
}
export default DetailPage
