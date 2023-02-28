import { isContentLoadingState } from '@/store'
import { Spin, theme } from 'antd'
import Layout, { Content } from 'antd/es/layout/layout'
import { useRecoilValue } from 'recoil'
import { Header } from '../header'

type Props = { children: React.ReactNode }

export const MainLayout = ({ children }: Props) => {
  const isLoading = useRecoilValue(isContentLoadingState)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Layout className='h-screen'>
      <Header />
      <Spin spinning={isLoading}>
        <Content
          className='p-6 m-0'
          style={{
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {children}
        </Content>
      </Spin>
    </Layout>
  )
}
