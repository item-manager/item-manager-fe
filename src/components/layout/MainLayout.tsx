import { theme } from 'antd'
import Layout, { Content } from 'antd/es/layout/layout'
import { Header } from '../header'

type Props = { children: React.ReactNode }

export const MainLayout = ({ children }: Props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Layout className='h-screen'>
      <Header />
      <Content
        className='p-6 m-0'
        style={{
          minHeight: 280,
          background: colorBgContainer,
        }}
      >
        {children}
      </Content>
    </Layout>
  )
}
