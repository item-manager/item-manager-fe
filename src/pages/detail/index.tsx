import { Space, Tabs, TabsProps, Typography } from 'antd'
import ItemDetail from './components/itemDetail'
import ItemHistory from './components/itemHistory'

const Detail = () => {
  return (
    <Space wrap size={14} className='mb-2'>
      <Typography.Title level={2} className='m-0'></Typography.Title>
    </Space>
  )
}

const DetailPage = () => {
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

  return (
    <>
      <Detail />
      <Tabs defaultActiveKey='1' items={items} />
    </>
  )
}
export default DetailPage
