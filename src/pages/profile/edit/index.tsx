import { LoginUserRS } from '@/apis'
import useModal from '@/hooks/useModal'
import { userState } from '@/store'
import { UserOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Typography,
  Upload,
  UploadProps,
} from 'antd'
import Search from 'antd/es/input/Search'
import { useForm } from 'antd/lib/form/Form'
import { useRecoilValue } from 'recoil'
import ChangePasswordModal from './changePasswordModal'

const props: UploadProps = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
}

const ProfileEditPage = () => {
  const { visible, showModal, hideModal } = useModal()
  const user = useRecoilValue(userState)!
  const queryClient = useQueryClient()

  const [form] = useForm()
  const [modal, contextHolder] = Modal.useModal()

  const deleteUser = async () => {
    modal.confirm({
      title: `정말로 회원 탈퇴를 하시겠습니까?`,
      content: <>모든 회원 정보와 데이터는 영구적으로 삭제되며, 되돌릴 수 없습니다.</>,
      okText: '탈퇴하기',
      okType: 'danger',
      onOk: async () => {
        // TODO 탈퇴
        // await httpClient.items.deleteItem(record.itemNo)
        queryClient.invalidateQueries()
        message.success('회원님의 탈퇴 요청이 정상적으로 처리되었습니다.')
      },
    })
  }

  return (
    <div className='flex flex-col items-center'>
      <Typography.Title level={2}>회원 정보 수정</Typography.Title>
      <Upload {...props}>
        <Avatar size={100} icon={<UserOutlined />} />
      </Upload>

      <Divider>회원 정보</Divider>
      <Form<LoginUserRS>
        form={form}
        initialValues={{
          userNo: user.userNo,
          username: user.username,
        }}
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 700 }}
        autoComplete='off'
        colon={false}
      >
        <Form.Item label='아이디'>
          <Input disabled />
        </Form.Item>

        <Form.Item label='닉네임' name='username' rules={[{ message: '닉네임을 입력해 주세요.' }]}>
          <Search
            placeholder='닉네임을 입력하세요.'
            enterButton='수정하기'
            onSearch={(value) => console.log('xxx', value)}
          />
        </Form.Item>

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
