import { httpClient } from '@/apis'
import { MainSpin } from '@/components/spin'
import { allSearchState, isLoggedInState, userState } from '@/store'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import PrivateRoutes from './PrivateRoutes'
import PublicRoutes from './PublicRoutes'

const Router = () => {
  const [_user, setUser] = useRecoilState(userState)
  const isLoggedIn = useRecoilValue(isLoggedInState)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const resetQuerystring = useResetRecoilState(allSearchState)

  useEffect(() => {
    console.log('최초탐?')
    // FIXME 최초 타므로 기존 조회조건이 매핑이 안됨
    resetQuerystring()
  }, [location, resetQuerystring])

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
