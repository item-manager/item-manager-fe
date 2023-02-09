import { Spin, SpinProps } from 'antd'

export const MainSpin = (props: SpinProps) => {
  return (
    <Spin className='flex items-center justify-center w-screen h-screen' size='large' {...props} />
  )
}
