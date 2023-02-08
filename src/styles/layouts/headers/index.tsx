import { httpClient } from '@/apis'
import { NavigationUtil } from '@/utils'
import { useNavigate } from 'react-router'

const Header = () => {
  const navigate = useNavigate()

  const onClickRouteLogin = () => {
    navigate(NavigationUtil.login)
  }

  const onClickLogout = () => {
    httpClient.auth.logout()
    alert('로그아웃 되셨습니다.')
    navigate(NavigationUtil.login)
  }

  return (
    <div className='w-screen h-16 bg-main flex items-center'>
      <div className='flex items-center w-4/5 h-full'>
        <h1 className='pl-10 text-2xl hover:cursor-pointer'>물품관리</h1>
      </div>
      <div className='flex items-center w-48 h-full justify-evenly'>
        <div
          className='text-white hover:cursor-pointer hover:opacity-80'
          onClick={onClickRouteLogin}
        >
          로그인
        </div>
        <div className='text-white hover:cursor-pointer hover:opacity-80' onClick={onClickLogout}>
          로그아웃
        </div>
      </div>
    </div>
  )
}
export default Header
