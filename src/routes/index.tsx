import { NavigationUtil } from '@/utils'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/login'
import Register from '@/pages/register'
import LocationsPage from '@/pages/locations'
import ItemsPage from '@/pages/items'

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate replace to='/login' />} />
      <Route path={NavigationUtil.login} element={<LoginPage />} />
      <Route path={NavigationUtil.register} element={<Register />} />
      <Route path={NavigationUtil.locations} element={<LocationsPage />} />
      <Route path={NavigationUtil.items} element={<ItemsPage />} />
    </Routes>
  )
}
export default Router
