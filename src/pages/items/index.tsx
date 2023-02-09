import { UserOutlined } from '@ant-design/icons'
import { Avatar, Space, Tabs, TabsProps, Typography } from 'antd'
import ConsumableTab from './components/tabs/ConsumableTab'
import EquipmentTab from './components/tabs/EquipmentTab'

const Intro = () => {
  return (
    <Space wrap size={16} className='mb-2'>
      <Avatar size={64} icon={<UserOutlined />} />
      <Typography.Title level={2}>안잉님 좋은 아침 입니다.</Typography.Title>
    </Space>
  )
}

const ItemsPage = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `소모품 관리`,
      children: <ConsumableTab />,
    },
    {
      key: '2',
      label: `비품 관리`,
      children: <EquipmentTab />,
    },
  ]

  return (
    <>
      <Intro />
      <Tabs defaultActiveKey='1' items={items} />
    </>
  )
}
export default ItemsPage
