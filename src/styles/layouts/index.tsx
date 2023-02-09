import { ReactNode } from 'react'
import { useMatch } from 'react-router'
import Header from './headers/'

interface LayoutProps {
  children: ReactNode
}

export default function Layout(props: LayoutProps) {
  const isShowRegister = useMatch('/register')
  const isShowLogin = useMatch('/login')

  return (
    <>
      {!isShowRegister && !isShowLogin && <Header />}
      <div>
        <div>{props.children}</div>
      </div>
    </>
  )
}
