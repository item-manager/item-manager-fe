import { httpClient } from '@/apis'
import { MainSpin } from '@/components/spin'
import { allSearchState, isLoggedInState, userState } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import PrivateRoutes from './PrivateRoutes'
import PublicRoutes from './PublicRoutes'

const Router = () => {
  const [_user, setUser] = useRecoilState(userState)
  const isLoggedIn = useRecoilValue(isLoggedInState)
  const location = useLocation()
  const resetQuerystring = useResetRecoilState(allSearchState)

  const firstUpdate = useRef(true)

  const { isLoading, data } = useQuery(['users'], httpClient.users.getUser, {
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (data?.data) {
      setUser(data.data)
    }
  }, [data?.data, setUser])

  useEffect(() => {
    let boolean = false
    ;(async function resetQuery() {
      await setTimeout(() => Promise.resolve())
      if (!boolean) {
        if (firstUpdate.current) {
          firstUpdate.current = false
          return
        }
        resetQuerystring()
      }
    })()

    return () => {
      boolean = true
    }
  }, [location.pathname, resetQuerystring])

  return <>{isLoading ? <MainSpin /> : isLoggedIn ? <PrivateRoutes /> : <PublicRoutes />}</>
}
export default Router
