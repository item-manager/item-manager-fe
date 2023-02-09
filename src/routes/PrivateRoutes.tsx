import { MainLayout } from '@/components/layout'
import ItemsPage from '@/pages/items'
import LocationsPage from '@/pages/locations'
import { NavigationUtil } from '@/utils'
import { Navigate, Outlet, Route, Routes } from 'react-router'

const Main = () => {
  return (
    <MainLayout>
      {/* <Suspense fallback={<></>}> */}
      <Outlet />
      {/* </Suspense> */}
    </MainLayout>
  )
}

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Main />}>
        <Route path={NavigationUtil.items} element={<ItemsPage />} />
        <Route path={NavigationUtil.locations} element={<LocationsPage />} />
        <Route path='*' element={<Navigate replace to={NavigationUtil.items} />} />
      </Route>
    </Routes>
  )
}

export default PrivateRoutes
