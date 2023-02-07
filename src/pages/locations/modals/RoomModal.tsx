import { CreateRoomRQ, httpClient } from '@/apis'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, InputRef, Modal } from 'antd'
import { useEffect, useRef, useState } from 'react'

type Props = {
  hideModal: () => void
  setRoomNo: (roomNo: number) => void
}
const RoomModal = ({ hideModal, setRoomNo }: Props) => {
  const inputRef = useRef<InputRef | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const queryClient = useQueryClient()
  const [form] = Form.useForm<CreateRoomRQ>()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleOk = () => {
    form.submit()
  }

  const onFinish = async (values: CreateRoomRQ) => {
    setConfirmLoading(true)

    try {
      const name = values.name.trim()
      const result = await httpClient.locations.createRoom({ name })
      if (result.data?.roomNo) {
        setRoomNo(result.data?.roomNo)
      }
      hideModal()
      queryClient.invalidateQueries({ queryKey: ['rooms'], exact: true })
    } catch (e) {
      console.error(e)
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <Modal
      title='방 추가'
      open={true}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={hideModal}
      width={300}
      okText={'추가'}
      cancelText={'닫기'}
      closable={false}
    >
      <Form
        form={form}
        name='basic'
        className='mt-3'
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 300 }}
        onFinish={onFinish}
        autoComplete='off'
      >
        <Form.Item
          label='방 이름'
          name='name'
          rules={[
            {
              required: true,
              transform(value) {
                return value?.trim()
              },
              message: '${label}을 입력해 주세요.',
            },
          ]}
        >
          <Input ref={inputRef} />
        </Form.Item>
        <Button htmlType='submit' hidden /> {/* Enter 이벤트 */}
      </Form>
    </Modal>
  )
}

export default RoomModal
