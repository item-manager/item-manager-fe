import { NavigationUtil } from '@/utils'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/login'
import Register from '@/pages/register'

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate replace to='/login' />} />
      <Route path={NavigationUtil.login} element={<LoginPage />} />
      <Route path={NavigationUtil.register} element={<Register />} />
    </Routes>
  )
}
export default Router
