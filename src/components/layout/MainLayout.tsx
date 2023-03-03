import { isContentLoadingState, isSideCollapsedState } from '@/store'
import { ApartmentOutlined, HomeOutlined, SmileOutlined } from '@ant-design/icons'
import { Grid, Menu, MenuProps, Spin, theme } from 'antd'
import Layout, { Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { Header } from '../header'

const { useBreakpoint } = Grid

const items = [
  { key: '1', icon: <HomeOutlined />, label: '물품 관리', path: '/items' },
  { key: '2', icon: <ApartmentOutlined />, label: '보관장소 관리', path: '/locations' },
  { key: '3', icon: <SmileOutlined />, label: '테스트 페이지', path: '/test' },
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

  useEffect(() => {
    setSelectedKey(findKey())
  }, [location])

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
              // defaultSelectedKeys={['1']}
              selectedKeys={selectedKey ? [selectedKey] : []}
              onClick={handleMenuClick}
              items={items}
            />
          </Sider>
        )}
        <Layout>
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
