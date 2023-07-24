import { allSearchState, currentTabKeyState, userState } from '@/store'
import { DEFAULT_PROFILE_IMAGE_URL } from '@/utils'
import { Avatar, Space, Tabs, TabsProps, Typography } from 'antd'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import ConsumableTab from './tabs/ConsumableTab'
import EquipmentTab from './tabs/EquipmentTab'

const Intro = () => {
  const user = useRecoilValue(userState)!
  return (
    <Space wrap size={16} className='mb-2'>
      <Avatar
        size={64}
        src={<img src={user.photoUrl || DEFAULT_PROFILE_IMAGE_URL} className='object-contain' />}
      />
      <Typography.Title level={2} className='m-0'>
        {user.username}님 좋은 하루되세요.
      </Typography.Title>
    </Space>
  )
}

const ItemsPage = () => {
  const [currentTabKey, setCurrentTabKey] = useRecoilState(currentTabKeyState)
  const resetQuerystring = useResetRecoilState(allSearchState)

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
        activeKey={currentTabKey || '0'}
        items={items}
        onChange={(key) => {
          resetQuerystring()
          setCurrentTabKey(key)
        }}
      />
    </>
  )
}
export default ItemsPage
