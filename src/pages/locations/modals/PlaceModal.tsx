import { CreateRoomRQ, httpClient } from '@/apis'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, InputRef, Modal, Select } from 'antd'
import { useEffect, useRef, useState } from 'react'

type Props = {
  roomNo: number
  hideModal: () => void
}
const PlaceModal = ({ roomNo, hideModal }: Props) => {
  const inputRef = useRef<InputRef | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const queryClient = useQueryClient()
  const [form] = Form.useForm<CreateRoomRQ>()

  const query = useQuery({
    queryKey: ['rooms'],
    queryFn: httpClient.locations.allRooms,
  })

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
      await httpClient.locations.createPlace({ roomNo, name })
      hideModal()
      queryClient.invalidateQueries({ queryKey: ['rooms', roomNo] })
    } catch (e) {
      console.error(e)
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <Modal
      title='위치 추가'
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
        initialValues={{
          roomNo,
        }}
      >
        <Form.Item
          label='방'
          name='roomNo'
          rules={[{ required: true, message: '${label}을 입력해 주세요.' }]}
        >
          <Select value={roomNo} disabled>
            {query.data?.data?.map((item) => {
              const { roomNo, name } = item

              return (
                <Select.Option key={roomNo} value={roomNo}>
                  {name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label='위치명'
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

export default PlaceModal
