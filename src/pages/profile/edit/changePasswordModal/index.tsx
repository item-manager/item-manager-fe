import { httpClient } from '@/apis'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Input, message, Modal } from 'antd'
import { AxiosError } from 'axios'
import { useState } from 'react'

type ChangePasswordModalProps = {
  hideModal: () => void
}

type ChangePasswordForm = {
  currentPassword: string
  newPassword: string
  newPasswordConfirm: string
}

const ChangePasswordModal = ({ hideModal }: ChangePasswordModalProps) => {
  const [form] = Form.useForm<ChangePasswordForm>()
  const queryClient = useQueryClient()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleOk = () => {
    form.submit()
  }

  const onFinish = async (values: any) => {
    setConfirmLoading(true)

    try {
      const { currentPassword, newPassword } = values

      await httpClient.users.changePassword({
        currentPassword,
        newPassword,
      })
      hideModal()

      message.success('비밀번호가 변경되었습니다.')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    } catch (e) {
      if (e instanceof AxiosError) {
        return message.error(e.response?.data.message)
      }

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
        confirmLoading={confirmLoading}
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
          requiredMark={false}
        >
          <Form.Item
            name='currentPassword'
            label='현재 비밀번호'
            rules={[{ required: true, message: '${label}를 입력해 주세요.' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name='newPassword'
            label='변경 비밀번호'
            rules={[
              {
                validator: async (_rule, value) => {
                  if (!value?.trim()) {
                    throw new Error('변경 비밀번호를 입력해 주세요.')
                  }

                  const currentPassword = form.getFieldValue('currentPassword')
                  if (value && currentPassword && currentPassword === value) {
                    throw new Error('현재 비밀번호와 새 비밀번호가 동일합니다.')
                  }

                  if (!/\d/.test(value)) {
                    throw new Error('최소한 하나 이상의 숫자가 있어야 합니다.')
                  }

                  if (!/[a-z]/.test(value)) {
                    throw new Error('최소한 하나 이상의 소문자가 있어야 합니다.')
                  }

                  if (!/[A-Z]/.test(value)) {
                    throw new Error('최소한 하나 이상의 대문자가 있어야 합니다.')
                  }

                  if (!/^[a-zA-Z\d`~!@#$%^&*()\-_=+]{6,20}$/.test(value)) {
                    throw new Error(
                      '길이가 6에서 20사이의 알파벳 대소문자와 숫자, 특수문자(`~!@#$%^&*()-_=+) 중 하나가 올 수 있습니다.'
                    )
                  }
                },
                validateTrigger: 'onSubmit',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name='newPasswordConfirm'
            label='변경 비밀번호 확인'
            rules={[
              {
                validator: async (_rule, value) => {
                  if (!value?.trim()) {
                    throw new Error('변경 비밀번호 확인을 입력해 주세요.')
                  }

                  const newPassword = form.getFieldValue('newPassword')
                  if (value && newPassword && newPassword !== value) {
                    throw new Error('비밀번호와 비밀번호 확인 값이 다릅니다.')
                  }
                },
                validateTrigger: 'onSubmit',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <button type='submit' className='hidden'></button>
        </Form>
      </Modal>
    </>
  )
}
export default ChangePasswordModal
