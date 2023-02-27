import { userState } from '@/store'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Space, Tabs, TabsProps, Typography } from 'antd'
import { useRecoilState, useRecoilValue } from 'recoil'
import ConsumableTab from './tabs/ConsumableTab'
import { consumableSearchState } from './tabs/ConsumableTab/store'
import EquipmentTab from './tabs/EquipmentTab'

const Intro = () => {
  const user = useRecoilValue(userState)!
  return (
    <Space wrap size={16} className='mb-2'>
      <Avatar size={64} icon={<UserOutlined />} />
      <Typography.Title level={2} className='m-0'>
        {user.username}님 좋은 아침 입니다.
      </Typography.Title>
    </Space>
  )
}

const ItemsPage = () => {
  const [{ currentTabKey }, setConsumableSearch] = useRecoilState(consumableSearchState)

  const items: TabsProps['items'] = [
    {
      key: '0',
      label: `소모품 관리`,
      children: <ConsumableTab />,
    },
    {
      key: '1',
      label: `비품 관리`,
      children: <EquipmentTab />,
    },
  ]

  return (
    <>
      <Intro />
      <Tabs
        activeKey={currentTabKey}
        items={items}
        onChange={(key) => setConsumableSearch((item) => ({ ...item, currentTabKey: key }))}
      />
    </>
  )
}
export default ItemsPage
