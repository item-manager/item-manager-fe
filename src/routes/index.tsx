import { NavigationUtil } from '@/utils'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/login'

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate replace to='/login' />} />
      <Route path={NavigationUtil.login} element={<LoginPage />} />
    </Routes>
  )
}
export default Router
