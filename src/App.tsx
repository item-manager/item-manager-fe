import logo from './logo.svg'
import { Button, ConfigProvider } from 'antd'

import 'antd/dist/reset.css'
import './index.css'

function App() {
  return (
    <ConfigProvider>
      <div className='App'>
        <Button type='primary'>Button</Button>
      </div>
    </ConfigProvider>
  )
}

export default App
