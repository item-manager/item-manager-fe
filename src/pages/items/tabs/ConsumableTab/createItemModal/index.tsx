import { CreateItemRQ, httpClient } from '@/apis'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Form,
  Modal,
  Input,
  Select,
  Radio,
  Row,
  Col,
  message,
  InputNumber,
  Upload,
  UploadProps,
  UploadFile,
  Popover,
  Button,
} from 'antd'
import { PictureOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { RoomsRS, PlacesRS } from '@/apis'
import { Label } from '@/components/label/Label'
import { PriorityProgressBar } from '@/components/progress'
import { AxiosError } from 'axios'
import { RcFile, UploadListType } from 'antd/es/upload/interface'
import ImgCrop from 'antd-img-crop'
import imageCompression from 'browser-image-compression'

type createItemProps = {
  hideModal: () => void
}

const CreateItemModal = ({ hideModal }: createItemProps) => {
  const queryClient = useQueryClient()

  const [form] = Form.useForm()
  const { TextArea } = Input
  const handleOk = () => {
    form.submit()
  }

  const [roomNo, setRoomNo] = useState<number | undefined>(undefined)
  const [priorityValue, setPriority] = useState(0)

  const { data: roomList } = useQuery({
    queryKey: ['roomList'],
    queryFn: async () => await httpClient.locations.allRooms(),
  })
  const getPlaces = useQuery({
    queryKey: ['rooms', roomNo],
    queryFn: async () => await httpClient.locations.getPlacesByRoomNo({ roomNo: roomNo }),
    enabled: roomNo !== undefined,
  })

  const onChangeRoomValue = async (value: number | undefined) => {
    if (value) {
      setRoomNo(value)
      form.setFieldValue('locationNo', null)
    }
  }
  const onChangePriority = (newValue: number | null): void => {
    setPriority(Number(newValue))
    form.setFieldValue('priority', Number(newValue))
  }

  // upload image
  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    return [{ uid: '-1', name: '' }]
  })
  const initFileList = (): void => {
    setFileList([{ uid: '-1', name: '' }])
  }
  const [loading, setLoading] = useState(false)
  const actionImgCompress = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    try {
      return await imageCompression(file, options)
    } catch (error) {
      console.log(error)
    }
  }
  const beforeImageUpload: UploadProps['beforeUpload'] = (file: RcFile, FileList: RcFile[]) => {
    setLoading(true)
    initFileList()
    new Promise((resolve) => {
      if (file) resolve(actionImgCompress(file))
    })
      .then((compressedFile) => {
        const blob = compressedFile as Blob
        setFileList([
          {
            uid: file.uid || '-1',
            name: '',
            originFileObj: new File([blob], file?.name || 'name', { type: blob.type }) as RcFile,
          },
        ])
      })
      .then(() => {
        setLoading(false)
      })

    return false
  }
  // upload image

  const onClickSave = async (values: CreateItemRQ) => {
    const file = fileList[0].originFileObj
    let imageRS = null
    if (file) {
      imageRS = await httpClient.images.saveImage({ file: file })
    }

    const data = {
      name: values.name,
      type: values.type,
      locationNo: values.locationNo,
      photoName: imageRS?.data?.filename,
      quantity: values.quantity,
      priority: values.priority,
      labels: values.labels,
      memo: values.memo,
    }
    console.log(data)

    try {
      await httpClient.items.createItem(data)

      message.success('물품이 추가되었습니다')
      queryClient.invalidateQueries({ queryKey: ['items'] })
      hideModal()
    } catch (error) {
      message.error('물품 추가에 실패하였습니다')
      if (error instanceof AxiosError) console.log('error createItem:', error.response?.data)
    }
  }
  const cancle = (): void => {
    initFileList()
    hideModal()
  }

  return (
    <>
      <Modal
        title=''
        open={true}
        onOk={handleOk}
        onCancel={cancle}
        okText={'저장'}
        cancelText={'닫기'}
        width={858}
        closable={false}
        bodyStyle={{ height: 420, overflowY: 'auto' }}
        centered={true}
        wrapClassName='item-modal'
        okButtonProps={{ className: 'max-md:w-[48%] md:w-1/4 md:h-9' }}
        cancelButtonProps={{ className: 'max-md:w-[48%] md:w-1/4 md:h-9' }}
      >
        <Form
          form={form}
          id='item-form'
          name='basic'
          className='w-full mt-3 '
          wrapperCol={{ span: 18 }}
          autoComplete='off'
          onFinish={onClickSave}
          initialValues={{
            type: 'CONSUMABLE',
            quantity: 0,
          }}
          validateMessages={{
            required: '입력이 필요합니다',
          }}
        >
          <div className='grid md:grid-cols-2'>
            <div className='flex flex-col justify-center w-full'>
              <div className='ml-auto mr-auto'>
                <ImgCrop rotationSlider>
                  <Upload
                    accept='image/*'
                    listType='picture-card'
                    fileList={fileList}
                    beforeUpload={beforeImageUpload}
                    multiple={false}
                    showUploadList={{
                      showPreviewIcon: false,
                      showRemoveIcon: false,
                    }}
                    iconRender={(file: UploadFile, listType?: UploadListType) => {
                      if (loading) {
                        return <LoadingOutlined />
                      } else {
                        return <PictureOutlined />
                      }
                    }}
                    maxCount={1}
                  >
                    {' '}
                  </Upload>
                </ImgCrop>
              </div>

              <div className='flex justify-center'>
                <Popover content='사진 제거' placement='bottom'>
                  <Button
                    type='text'
                    icon={<DeleteOutlined />}
                    size='middle'
                    className='flex justify-center items-center'
                    onClick={initFileList}
                  />
                </Popover>
              </div>
            </div>

            <div className='flex flex-col w-full items-center'>
              <Form.Item hidden name='priority'>
                <InputNumber />
              </Form.Item>
              <div className='flex justify-center w-full mt-8'>
                <Row className='flex items-center w-full'>
                  <Col className='w-1/6'>
                    <Form.Item>
                      <PriorityProgressBar
                        priority={priorityValue}
                        strokeWidth={4}
                        className='w-8 cursor-pointer select-none'
                        onChange={onChangePriority}
                      />
                    </Form.Item>
                  </Col>
                  <Col className='flex w-5/6'>
                    <Form.Item name='name' rules={[{ required: true }]} className='w-full'>
                      <Input
                        placeholder='물품명 입력'
                        className='w-full h-12 border-none'
                        allowClear
                        name='name'
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <div className='flex flex-row w-full'>
                <Form.Item
                  // label='분류ㅤㅤ'
                  label='분류'
                  name='type'
                  rules={[{ required: true }]}
                  colon={false}
                  className='w-full'
                  labelCol={{ span: 4 }}
                  labelAlign='left'
                >
                  <Radio.Group>
                    <Radio value={'CONSUMABLE'}>소모품</Radio>
                    <Radio value={'EQUIPMENT'}>비품</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>

              <div className='flex flex-row w-full'>
                <Form.Item
                  label='수량'
                  name='quantity'
                  colon={false}
                  className='w-1/2'
                  labelCol={{ span: 8 }}
                  labelAlign='left'
                  rules={[
                    { required: true, message: '${label}을 입력해 주세요.' },
                    { type: 'number', min: 0, message: '0보다 큰 값을 입력해주세요' },
                  ]}
                >
                  <InputNumber<number>
                    className='w-5/6'
                    formatter={(value) =>
                      value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                    }
                    parser={(value) => (value ? parseInt(value.replace(/\$\s?|(,*)/g, '')) : 0)}
                    max={999}
                    onClick={() => {
                      form.setFieldValue('quantity', null)
                    }}
                  />
                </Form.Item>
              </div>

              <div className='flex flex-row grid-cols-2 items-center w-full'>
                <Form.Item
                  label='장소'
                  name='roomNo'
                  className='w-1/2'
                  colon={false}
                  labelCol={{ span: 8 }}
                  labelAlign='left'
                >
                  <Select
                    onChange={onChangeRoomValue}
                    className='w-5/6'
                    options={roomList?.data?.map((el: RoomsRS) => ({
                      value: el.roomNo,
                      label: el.name,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  label='위치'
                  name='locationNo'
                  rules={[{ required: true, message: '필수: 장소를 선택하면 목록이 생성됩니다' }]}
                  className='w-1/2'
                  colon={false}
                  labelCol={{ span: 4 }}
                  labelAlign='left'
                >
                  <Select
                    id='item-form-select-place'
                    className='w-5/6'
                    options={
                      getPlaces?.data?.data?.map((el: PlacesRS) => ({
                        value: el.placeNo,
                        label: el.name,
                        disabled: !roomNo,
                      })) || [
                        {
                          value: 0,
                          label: '장소을 선택하면 목록이 생성됩니다',
                          disabled: roomNo === undefined,
                        },
                      ]
                    }
                  ></Select>
                </Form.Item>
              </div>

              <div className='flex justify-center w-full'>
                <Form.Item
                  // label='라벨ㅤㅤ'
                  label='라벨'
                  name='labels'
                  colon={false}
                  className='w-full'
                  labelCol={{ span: 4 }}
                  labelAlign='left'
                >
                  <Label />
                </Form.Item>
              </div>

              <div className='w-full'>
                <Form.Item
                  label='메모'
                  name='memo'
                  colon={false}
                  className='w-full'
                  labelCol={{ span: 4 }}
                  labelAlign='left'
                >
                  <TextArea placeholder='메모' rows={2} className='w-full' allowClear />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  )
}
export default CreateItemModal
