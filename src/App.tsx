import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import koKR from 'antd/locale/ko_KR'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecoilRoot } from 'recoil'
import Router from './routes'

import 'antd/dist/reset.css'
import './index.css'
import { RecoilURLSyncJSON } from 'recoil-sync'

function App() {
  const queryClient = new QueryClient()

  return (
    <RecoilRoot>
      <RecoilURLSyncJSON location={{ part: 'queryParams' }}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider
            locale={koKR}
            theme={{
              token: {
                colorPrimary: '#2E8B57',
                fontFamily: 'Inter',
                colorBgContainer: '#FBFBFB',
              },
            }}
          >
            <StyleProvider hashPriority='high'>
              <div className='App'>
                <Router />
              </div>
            </StyleProvider>
          </ConfigProvider>
        </QueryClientProvider>
      </RecoilURLSyncJSON>
    </RecoilRoot>
  )
}

export default App
