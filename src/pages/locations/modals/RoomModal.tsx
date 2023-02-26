import { CreateRoomRQ, httpClient, RoomsRS, UpdateRoomRQ } from '@/apis'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, InputRef, Modal } from 'antd'
import { useEffect, useRef, useState } from 'react'

type Props = {
  record?: RoomsRS
  hideModal: () => void
  setRoomNo: (roomNo: number) => void
}
const RoomModal = ({ record, hideModal, setRoomNo }: Props) => {
  const isUpdateModal = !!record

  const inputRef = useRef<InputRef | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const queryClient = useQueryClient()
  const [form] = Form.useForm<CreateRoomRQ & UpdateRoomRQ>()

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const handleOk = () => {
    form.submit()
  }

  const onFinish = async (values: CreateRoomRQ & UpdateRoomRQ) => {
    setConfirmLoading(true)

    try {
      const name = values.name.trim()

      if (isUpdateModal) {
        // 수정
        await httpClient.locations.patchRoom(record.roomNo, { name })
      } else {
        // 신규 추가
        const result = await httpClient.locations.createRoom({ name })
        if (result.data?.roomNo) {
          setRoomNo(result.data?.roomNo)
        }
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
      title={isUpdateModal ? '방 수정' : '방 추가'}
      open={true}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={hideModal}
      width={300}
      okText={'저장'}
      cancelText={'닫기'}
      closable={false}
    >
      <Form
        form={form}
        name='basic'
        className='mt-3'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 300 }}
        onFinish={onFinish}
        autoComplete='off'
        initialValues={{
          ...record,
        }}
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
