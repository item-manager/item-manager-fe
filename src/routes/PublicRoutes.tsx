import LoginPage from '@/pages/login'
import Register from '@/pages/register'
import { NavigationUtil } from '@/utils'
import { Navigate, Route, Routes } from 'react-router'

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate replace to={NavigationUtil.login} />} />
      <Route path={NavigationUtil.login} element={<LoginPage />} />
      <Route path={NavigationUtil.register} element={<Register />} />
      <Route path='*' element={<Navigate replace to={NavigationUtil.login} />} />
    </Routes>
  )
}

export default PublicRoutes
