import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import koKR from 'antd/locale/ko_KR'
import 'dayjs/locale/ko'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecoilRoot } from 'recoil'
import Router from './routes'

import 'antd/dist/reset.css'
import { AxiosError } from 'axios'
import { useCallback } from 'react'
import { RecoilURLSyncJSON } from 'recoil-sync'
import SessionInvalidModal from './components/modals/SessionInvalidModal'
import useModal from './hooks/useModal'
import './index.css'

const isAxiosUnauthorizedError = (error: AxiosError) => error.response?.status === 401

function App() {
  const { showModal, visible } = useModal()

  const retryFn = useCallback(
    (_failureCount: number, error: unknown) => {
      if (error instanceof AxiosError) {
        if (isAxiosUnauthorizedError(error)) {
          if (error.config?.url !== '/users/session') {
            showModal()
          }

          return false
        }
      }

      return true
    },
    [showModal]
  )

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: retryFn },
      mutations: { retry: retryFn },
    },
  })

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
                {visible && <SessionInvalidModal />}
              </div>
            </StyleProvider>
          </ConfigProvider>
        </QueryClientProvider>
      </RecoilURLSyncJSON>
    </RecoilRoot>
  )
}

export default App
