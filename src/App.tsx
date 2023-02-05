import { ConfigProvider } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import { RecoilRoot } from 'recoil'
import Router from './routes'

import 'antd/dist/reset.css'
import './index.css'

function App() {
  return (
    <RecoilRoot>
      <ConfigProvider>
        <StyleProvider hashPriority='high'>
          <div className='App'>
            <Router />
          </div>
        </StyleProvider>
      </ConfigProvider>
    </RecoilRoot>
  )
}

export default App
