import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import koKR from 'antd/locale/ko_KR'
import 'dayjs/locale/ko'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecoilRoot } from 'recoil'
import Router from './routes'

import 'antd/dist/reset.css'
import { RecoilURLSync } from 'recoil-sync'
import './index.css'

function App() {
  const queryClient = new QueryClient()

  return (
    <RecoilRoot>
      <RecoilURLSync
        location={{
          part: 'queryParams',
          param: 'q',
        }}
        serialize={(x) => window.btoa(window.unescape(encodeURIComponent(JSON.stringify(x))))}
        deserialize={(x) => JSON.parse(decodeURIComponent(escape(window.atob(x))))}
      >
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
      </RecoilURLSync>
    </RecoilRoot>
  )
}

export default App
