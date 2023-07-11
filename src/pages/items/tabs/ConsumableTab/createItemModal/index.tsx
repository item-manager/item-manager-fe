import { CreateItemRQ, ResultSaveImageRS, httpClient } from '@/apis'
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
  RadioChangeEvent,
  InputNumber,
  Upload,
  UploadProps,
  UploadFile,
} from 'antd'
import { PictureOutlined, LoadingOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { RoomsRS, PlacesRS } from '@/apis'
import { Label } from '@/components/label/Label'
import { PriorityProgressBar } from '@/components/progress'
import { AxiosError } from 'axios'
import { RcFile, UploadListType } from 'antd/es/upload/interface'
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

  const [priorityValue, setPriority] = useState(0)
  const [roomValue, setRoomValue] = useState<any>()

  const { data: roomsList } = useQuery({
    queryKey: ['roomsList'],
    queryFn: async () => await httpClient.locations.allRooms(),
  })

  const onChangePriority = (newValue: number | null): void => {
    setPriority(Number(newValue))
    form.setFieldValue('priority', Number(newValue))
  }
  const onChangeType = (e: RadioChangeEvent) => {
    form.setFieldValue('type', e.target.value)
  }
  const onChangeRoomsList = async (value: number | undefined) => {
    if (value) {
      const result = await httpClient.locations.getPlacesByRoomNo({ roomNo: value })
      setRoomValue(result)
    }
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
    new Promise((resolve) => {
      resolve(deleteImage())
    }).then(() => {
      initFileList()
      setLoading(true)
    })
    return new Promise((resolve) => {
      resolve(actionImgCompress(file as File))
    })
  }
  const onImageChange: UploadProps['onChange'] = ({ file: file, fileList: newFileList }) => {
    const filename = file.response?.data?.filename

    form.setFieldValue('photoName', filename)

    newFileList.forEach((file) => {
      file.fileName = filename
    })
    setFileList(newFileList)
    setLoading(false)
  }
  const deleteImage = (): void => {
    fileList.forEach((file) => {
      if (file.fileName) {
        httpClient.images.deleteImage(file.fileName)
      }
    })
  }
  // upload image

  const onClickSave = async (values: CreateItemRQ) => {
    console.log(values)

    try {
      await httpClient.items.createItem({
        name: values.name,
        type: values.type,
        locationNo: values.locationNo,
        photoName: values.photoName,
        quantity: values.quantity,
        priority: values.priority,
        labels: values.labels,
        memo: values.memo,
      })

      message.success('물품을 추가 하셨습니다.')
      queryClient.invalidateQueries({ queryKey: ['items'] })
      hideModal()
    } catch (error) {
      if (error instanceof AxiosError) console.log('error createItem:', error.response?.data)
    }
  }
  const cancle = (): void => {
    deleteImage()
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
                <Upload
                  accept='image/*'
                  action={'/images'}
                  listType='picture-card'
                  fileList={fileList}
                  beforeUpload={beforeImageUpload}
                  onChange={onImageChange}
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
              </div>

              <Form.Item name='photoName' hidden>
                <Input />
              </Form.Item>
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
                  colon={false}
                  className='w-full'
                  labelCol={{ span: 4 }}
                  labelAlign='left'
                >
                  <Radio.Group onChange={onChangeType}>
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
                  label='보관장소'
                  name='roomNo'
                  className='w-1/2'
                  colon={false}
                  labelCol={{ span: 8 }}
                  labelAlign='left'
                >
                  <Select onChange={onChangeRoomsList} className='w-5/6'>
                    {roomsList?.data?.map((el: RoomsRS) => (
                      <Select.Option key={el.roomNo} value={el.roomNo}>
                        <div>{el.name}</div>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label='위치'
                  name='locationNo'
                  rules={[{ required: true }]}
                  className='w-1/2'
                  colon={false}
                  labelCol={{ span: 4 }}
                  labelAlign='left'
                >
                  <Select className='w-5/6' disabled={!roomValue}>
                    {roomValue?.data?.map((el: PlacesRS) => (
                      <Select.Option key={el.placeNo} value={el.placeNo}>
                        <div>{el.name}</div>
                      </Select.Option>
                    ))}
                  </Select>
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
