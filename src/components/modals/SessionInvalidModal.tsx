import { NavigationUtil } from '@/utils'
import { Modal } from 'antd'
import { useEffect } from 'react'

const SessionInvalidModal = () => {
  const [modal, contextHolder] = Modal.useModal()

  const goToLoginPage = () => {
    setTimeout(() => ((window as Window).location = NavigationUtil.login), 300)
  }

  useEffect(() => {
    const { destroy } = modal.error({
      title: '로그인 세션이 만료되었습니다.',
      content:
        `다시 로그인 후 이용해 주세요.` +
        (process.env.NODE_ENV === 'development' ? ' (개발은 두번 띄워짐)' : ''),
      maskClosable: false,
      onOk: goToLoginPage,
      onCancel: goToLoginPage,
    })

    return () => {
      destroy()
    }
  }, [])

  return contextHolder
}

export default SessionInvalidModal
