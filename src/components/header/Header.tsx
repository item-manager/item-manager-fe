import { httpClient } from '@/apis'
import { isSideCollapsedState, userState } from '@/store'
import { NavigationUtil } from '@/utils'
import { MenuOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { useNavigate } from 'react-router'
import { useRecoilState, useSetRecoilState } from 'recoil'
import MainLogo from '../logo/MainLogo'

export const Header = () => {
  const setCollapsed = useSetRecoilState(isSideCollapsedState)
  const [_user, setUser] = useRecoilState(userState)

  const navigate = useNavigate()

  const onClickLogout = async () => {
    try {
      await httpClient.auth.logout()
      setUser(null)
      message.success('로그아웃 되었습니다.')
      navigate(NavigationUtil.login)
    } catch (error) {
      if (error instanceof Error) console.log('error logout:', error.message)
    }
  }

  const goHome = () => {
    navigate('/')
  }

  return (
    <div className='z-10 flex items-center flex-grow-0 flex-shrink-0 w-full pl-6 pr-10 shadow-sm basis-16 bg-bkg'>
      <MenuOutlined className='w-5 h-5' onClick={() => setCollapsed((value) => !value)} />
      <div className='ml-2'>
        <div className='flex items-center cursor-pointer' onClick={() => goHome()}>
          <div className='w-8'>
            <MainLogo />
          </div>
          <h1 className='text-2xl font-semibold'>물품 관리</h1>
        </div>
      </div>
      <div className='flex items-center ml-auto gap-x-4 '>
        <button className='hover:opacity-80' onClick={onClickLogout}>
          로그아웃
        </button>
      </div>
    </div>
  )
}
