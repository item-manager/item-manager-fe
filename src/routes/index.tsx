import { httpClient } from '@/apis'
import { MainSpin } from '@/components/spin'
import { allSearchState, isLoggedInState, userState } from '@/store'
import { useEffect, useState, useRef } from 'react'
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

  const firstUpdate = useRef(true)

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
