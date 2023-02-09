import { httpClient } from '@/apis'
import { MainSpin } from '@/components/spin'
import { isLoggedInState, userState } from '@/store'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import PrivateRoutes from './PrivateRoutes'
import PublicRoutes from './PublicRoutes'

const Router = () => {
  const [_user, setUser] = useRecoilState(userState)
  const isLoggedIn = useRecoilValue(isLoggedInState)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    try {
      const result = await httpClient.users.getUser()
      if (result.data) {
        setUser(result.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return <>{isLoading ? <MainSpin /> : isLoggedIn ? <PrivateRoutes /> : <PublicRoutes />}</>
}
export default Router
