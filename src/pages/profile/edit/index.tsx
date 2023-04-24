import { httpClient, LoginUserRS, ResultSaveImageRS } from '@/apis'
import useModal from '@/hooks/useModal'
import { userState } from '@/store'
import { DEFAULT_PROFILE_IMAGE_URL, NavigationUtil } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import ChangePasswordModal from './changePasswordModal'

const ProfileEditPage = () => {
  const navigate = useNavigate()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const { visible, showModal, hideModal } = useModal()
  const [user, setUser] = useRecoilState(userState)
  const queryClient = useQueryClient()

  const [form] = Form.useForm()
  const [modal, contextHolder] = Modal.useModal()

  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    return [
      {
        uid: '-1',
        name: 'profile.png',
        status: 'done',
        url: user!.photoUrl || DEFAULT_PROFILE_IMAGE_URL,
      },
    ]
  })

  const username = user!.username
  const photoName = user!.photoUrl?.replace(/^\/images\//, '') || null
  const newUsername = Form.useWatch('username', form)
  const newPhotoName = Form.useWatch('photoName', form)

  const isDirty = () => {
    if (newUsername === undefined || newPhotoName === undefined) {
      return false
    }

    return username !== newUsername || photoName !== newPhotoName
  }

  const handleChange: UploadProps<ResultSaveImageRS>['onChange'] = ({
    fileList: newFileList,
    file,
  }) => {
    const filename = file.response?.data?.filename

    form.setFieldValue('photoName', filename)

    setFileList(newFileList)
  }

  const onFinish = async (values: any) => {
    setConfirmLoading(true)

    try {
      const { username, photoName } = values
      console.log({ username, photoName })

      await httpClient.users.updateUserInfo({
        username,
        photoName,
      })

      message.success('회원 정보가 변경되었습니다.')
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

  const deleteUser = async () => {
    modal.confirm({
      title: `정말로 회원 탈퇴를 하시겠습니까?`,
      content: <>모든 회원 정보와 데이터는 영구적으로 삭제되며, 되돌릴 수 없습니다.</>,
      okText: '탈퇴하기',
      okType: 'danger',
      onOk: async () => {
        try {
          await httpClient.users.deleteUser()
          queryClient.invalidateQueries()
          message.success('회원님의 탈퇴 요청이 정상적으로 처리되었습니다.')
          setUser(null)
          navigate(NavigationUtil.login)
        } catch (e) {
          if (e instanceof AxiosError) {
            return message.error(e.response?.data.message)
          }

          console.error(e)
        }
      },
    })
  }

  return (
    <div className='flex flex-col items-center'>
      <Typography.Title level={2}>회원 정보 수정</Typography.Title>
      <Form<LoginUserRS>
        form={form}
        initialValues={{ username, photoName }}
        id='self'
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: 300 }}
        autoComplete='off'
        colon={false}
        requiredMark={false}
        onFinish={onFinish}
      >
        <div className='ml-auto mr-auto w-[110px]'>
          <Upload
            accept='image/*'
            action={'/images'}
            listType='picture-circle'
            fileList={fileList}
            onChange={handleChange}
            multiple={false}
            showUploadList={{
              showPreviewIcon: false,
              showRemoveIcon: false,
            }}
            maxCount={1}
          >
            {' '}
          </Upload>
        </div>

        <Divider>회원 정보</Divider>

        {/* <Form.Item label='아이디'>
          <Input disabled />
        </Form.Item> */}

        <Form.Item
          label='닉네임'
          name='username'
          rules={[
            { required: true, message: '${label}을 입력해 주세요.', validateTrigger: 'onSubmit' },
          ]}
        >
          <Input placeholder='닉네임을 입력하세요.' />
        </Form.Item>

        <Form.Item name='photoName' hidden>
          <Input />
        </Form.Item>

        <Button
          type='primary'
          block
          htmlType='submit'
          loading={confirmLoading}
          disabled={!isDirty()}
        >
          수정하기
        </Button>

        <Divider></Divider>
        <div className='flex justify-end gap-2'>
          <Button htmlType='button' onClick={() => showModal()}>
            비밀번호 변경
          </Button>
          <Button htmlType='button' danger onClick={deleteUser}>
            탈퇴하기
          </Button>
        </div>
      </Form>

      {contextHolder}

      {/* <ChangePasswordModal hideModal={hideModal} /> */}
      {visible && <ChangePasswordModal hideModal={hideModal} />}
    </div>
  )
}
export default ProfileEditPage
