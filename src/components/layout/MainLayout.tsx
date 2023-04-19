import { drawerOpenState, isContentLoadingState, isSideCollapsedState } from '@/store'
import { NavigationUtil } from '@/utils'
import { ApartmentOutlined, HomeOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons'
import { Drawer, Grid, Menu, MenuProps, Spin, theme } from 'antd'
import Layout, { Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Header } from '../header'

const { useBreakpoint } = Grid

const items = [
  { key: '1', icon: <HomeOutlined />, label: '물품 관리', path: NavigationUtil.items },
  { key: '2', icon: <ApartmentOutlined />, label: '보관장소 관리', path: NavigationUtil.locations },
  { key: '3', icon: <UserOutlined />, label: '회원 정보', path: NavigationUtil.profileEdit },
  { key: '4', icon: <SmileOutlined />, label: '테스트 페이지', path: NavigationUtil.test },
]

const findKey = () => items.find((_item) => location.pathname.startsWith(_item.path))?.key

type Props = { children: React.ReactNode }
export const MainLayout = ({ children }: Props) => {
  const collapsed = useRecoilValue(isSideCollapsedState)
  const screens = useBreakpoint()
  const navigate = useNavigate()
  const isLoading = useRecoilValue(isContentLoadingState)
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const location = useLocation()
  const [selectedKey, setSelectedKey] = useState(findKey())
  const [open, setOpen] = useRecoilState(drawerOpenState)

  useEffect(() => {
    setSelectedKey(findKey())
  }, [location])

  const onClose = () => {
    setOpen(false)
  }

  const handleMenuClick: MenuProps['onClick'] = (item) => {
    const clicked = items.find(({ key }) => key === item.key)
    navigate(clicked!.path)
  }

  return (
    <Layout className='min-h-screen'>
      <Header />
      <Layout hasSider>
        {!screens.xs && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            breakpoint='sm'
            theme='light'
            width={220}
            className='pt-4 shadow-sm'
            collapsedWidth={60}
          >
            <Menu
              theme='light'
              mode='inline'
              selectedKeys={selectedKey ? [selectedKey] : []}
              onClick={handleMenuClick}
              items={items}
            />
          </Sider>
        )}

        <Drawer placement='left' autoFocus closable onClose={onClose} open={open}>
          <Menu
            theme='light'
            mode='vertical'
            selectedKeys={selectedKey ? [selectedKey] : []}
            onClick={(e) => {
              onClose()
              handleMenuClick(e)
            }}
            items={items}
          />
        </Drawer>
        <Layout>
          {/* {screens.xs && (
            <Menu
              theme='light'
              mode='horizontal'
              // defaultSelectedKeys={['1']}
              selectedKeys={selectedKey ? [selectedKey] : []}
              onClick={handleMenuClick}
              items={items}
            />
          )} */}
          <div className='p-2 mx-4 my-0'></div>
          <Spin spinning={isLoading} wrapperClassName='flex-1'>
            <Content
              className='min-h-full p-6 mx-4 my-0'
              style={{
                background: colorBgContainer,
              }}
            >
              {children}
            </Content>
          </Spin>
          <div className='p-2 mx-4 my-0'></div>
        </Layout>
      </Layout>
    </Layout>
  )
}
