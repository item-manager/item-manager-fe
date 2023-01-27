import { Button, ConfigProvider } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'

import 'antd/dist/reset.css'
import './index.css'

function App() {
  return (
    <ConfigProvider>
      <StyleProvider hashPriority='high'>
        <div className='App'>
          <Button type='primary'>Button</Button>
        </div>
      </StyleProvider>
    </ConfigProvider>
  )
}

export default App
