import { httpClient } from '@/apis'
import { userState } from '@/store'
import { NavigationUtil } from '@/utils'
import { useNavigate } from 'react-router'
import { useRecoilState } from 'recoil'

export const Header = () => {
  const [_user, setUser] = useRecoilState(userState)
  const navigate = useNavigate()

  const onClickRouteLogin = () => {
    navigate(NavigationUtil.login)
  }

  const onClickLogout = async () => {
    try {
      await httpClient.auth.logout()
      setUser(null)
      alert('로그아웃 되셨습니다.')
      navigate(NavigationUtil.login)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className='flex items-center w-screen h-16 bg-main'>
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
