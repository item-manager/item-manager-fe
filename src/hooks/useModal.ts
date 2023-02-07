import { useCallback, useState } from 'react'

const useModal = () => {
  const [visible, setVisible] = useState(false)
  const showModal = useCallback(() => setVisible(true), [setVisible])
  const hideModal = useCallback(() => setVisible(false), [setVisible])

  return {
    visible,
    showModal,
    hideModal,
  }
}

export default useModal
