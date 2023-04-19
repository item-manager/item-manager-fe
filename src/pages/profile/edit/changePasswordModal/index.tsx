import { useQueryClient } from '@tanstack/react-query'
import { Form, Input, message, Modal } from 'antd'
import { useState } from 'react'

type ChangePasswordModalProps = {
  hideModal: () => void
}

const ChangePasswordModal = ({ hideModal }: ChangePasswordModalProps) => {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleOk = () => {
    form.submit()
  }

  const onFinish = async (values: any) => {
    setConfirmLoading(true)

    try {
      // const name = values.name.trim()
      // await httpClient.locations.patchPlace(record.placeNo, {
      //   roomNo: values.roomNo,
      //   name,
      // })
      hideModal()
      message.success('저장되었습니다.')
      // queryClient.invalidateQueries({ queryKey: ['rooms', roomNo] })
    } catch (e) {
      console.error(e)
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <>
      <Modal
        title={'비밀번호 변경'}
        open={true}
        // confirmLoading={confirmLoading}
        onCancel={hideModal}
        width={400}
        closable={false}
        onOk={handleOk}
        okText={'비밀번호 변경'}
        cancelText={'닫기'}
      >
        <Form
          form={form}
          name='basic'
          className='mt-3'
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Form.Item name='password' label='현재 비밀번호'>
            <Input.Password />
          </Form.Item>
          <Form.Item name='newPassword' label='변경 비밀번호'>
            <Input.Password />
          </Form.Item>
          <Form.Item name='newPasswordConfirm' label='변경 비밀번호 확인'>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default ChangePasswordModal
