import { useCallback, useState } from 'react'

const useModal = () => {
  const [visible, setVisible] = useState(false)
  const showModal = useCallback(() => setVisible(true), [setVisible])
  const hideModal = useCallback(() => setVisible(false), [setVisible])

  const [isEdit, setIsEdit] = useState(false)
  const showEditModal = useCallback(() => setIsEdit(true), [setIsEdit])
  const hideEditModal = useCallback(() => setIsEdit(false), [setIsEdit])

  const [isItemUse, setIsItemUse] = useState(false)
  const showItemUseModal = useCallback(() => setIsItemUse(true), [setIsItemUse])
  const hideItemUseModal = useCallback(() => setIsItemUse(false), [setIsItemUse])

  return {
    visible,
    showModal,
    hideModal,
    isEdit,
    showEditModal,
    hideEditModal,
    isItemUse,
    showItemUseModal,
    hideItemUseModal,
  }
}

export default useModal
