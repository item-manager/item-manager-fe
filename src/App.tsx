import { Button, ConfigProvider } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import { RecoilRoot } from 'recoil'

import 'antd/dist/reset.css'
import './index.css'

function App() {
  return (
    <RecoilRoot>
      <ConfigProvider>
        <StyleProvider hashPriority='high'>
          <div className='App'>
            <Button type='primary'>Button</Button>
          </div>
        </StyleProvider>
      </ConfigProvider>
    </RecoilRoot>
  )
}

export default App
