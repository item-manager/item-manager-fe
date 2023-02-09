import PrivateRoutes from './PrivateRoutes'
import PublicRoutes from './PublicRoutes'

const Router = () => {
  // TODO 로그인 여부 관리 필요
  const isLoggedIn = false

  return <>{isLoggedIn ? <PrivateRoutes /> : <PublicRoutes />}</>
}
export default Router
