import { httpClient } from '@/apis'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Form,
  Modal,
  Input,
  Select,
  Radio,
  Row,
  Col,
  message,
  Image,
  RadioChangeEvent,
} from 'antd'
import { ChangeEvent, useCallback, useRef, useState } from 'react'
import { RoomsRS, PlacesRS } from '@/apis'
import { Label, selectedValuesState } from '@/components/label/Label'
import { useRecoilState } from 'recoil'
import { PriorityProgressBar } from '@/components/progress'

type createItemProps = {
  hideModal: () => void
}

const CreateItemModal = ({ hideModal }: createItemProps) => {
  const [selectedValues] = useRecoilState(selectedValuesState)

  const [form] = Form.useForm()

  const [inputValue, setInputValue] = useState(0)

  const [placeNo, setPlaceNo] = useState(0)

  const { TextArea } = Input

  const [roomValue, setRoomValue] = useState<any>()
  const queryClient = useQueryClient()

  const [imageUrl, setImageUrl] = useState<any>('')

  const imgRef = useRef<HTMLInputElement>(null)

  const [filename, setFilename] = useState('')

  const [inputs, setInputs] = useState({
    name: '',
    description: '',
    type: 'CONSUMABLE',
  })

  const { data: roomsList } = useQuery({
    queryKey: ['roomsList'],
    queryFn: async () => await httpClient.locations.allRooms(),
  })

  const { mutateAsync } = useMutation(httpClient.items.createItem)

  const handleOk = () => {
    form.submit()
  }

  const onChangePriority = (newValue: number | null): void => {
    setInputValue(Number(newValue))
  }

  // const handleTypeChange = (value: string) => {
  //   const { name, description } = inputs

  //   setInputs({
  //     name,
  //     description,
  //     type: value,
  //   })
  // }

  const handleTypeChange = (e: RadioChangeEvent) => {
    const { name, description } = inputs

    setInputs({
      name,
      description,
      type: e.target.value,
    })
  }

  const onChangeRoomsList = async (value: number | undefined) => {
    if (value) {
      const result = await httpClient.locations.getPlacesByRoomNo({ roomNo: value })
      setRoomValue(result)
    }
  }

  const onChangeInputs = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs({
      ...inputs,
      [event.target.name]: event.target.value,
    })
  }

  const onChangePlaceNo = (placeNo: number) => {
    setPlaceNo(placeNo)
  }

  const onChangeFile = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files![0]
      const fileReader = new FileReader()
      if (file) fileReader.readAsDataURL(file)
      fileReader.onload = (data) => {
        setImageUrl(data?.target?.result)
      }

      const formData = new FormData()
      formData.append('file', file)

      // @ts-ignore
      const { data } = await httpClient.images.postImage({ file: formData.getAll('file')[0] })
      setFilename(data?.filename)
    },
    [setImageUrl]
  )

  const onClickImg = () => {
    imgRef.current?.click()
  }

  const onClickSave = async () => {
    const { name, description, type } = inputs

    if (!name || !type || !placeNo) {
      return message.error('물품 추가를 실패하셨습니다.')
    }

    try {
      await mutateAsync({
        name,
        type,
        locationNo: placeNo,
        locationMemo: description,
        photoName: filename,
        priority: inputValue,
        labels: selectedValues,
      })
      message.success('물품을 추가 하셨습니다.')
      queryClient.invalidateQueries({ queryKey: ['items'] })
      hideModal()
    } catch (error) {
      if (error instanceof Error) console.log('error createItem:', error.message)
    }
  }

  return (
    <>
      <Modal
        title=''
        open={true}
        onOk={handleOk}
        onCancel={hideModal}
        okText={'저장'}
        cancelText={'닫기'}
        width={858}
        // width={1000}
        closable={false}
        bodyStyle={{ height: 370, overflowY: 'auto' }}
        centered={true}
      >
        <Form
          form={form}
          name='basic'
          className='w-full mt-3 '
          wrapperCol={{ span: 18 }}
          autoComplete='off'
        >
          {/* <div className='flex flex-row'> */}
          <div className='grid xl:grid-cols-2'>
            <div className='flex items-center justify-center hover:cursor-pointer w-full'>
              {/* <div className='w-full'> */}
              {imageUrl ? (
                <>
                  <img src={imageUrl} onClick={onClickImg} />
                  <input
                    className='hidden w-300 h-332'
                    type='file'
                    name='file'
                    ref={imgRef}
                    onChange={onChangeFile}
                  />
                </>
              ) : (
                <>
                  <div
                    className='flex items-center justify-center w-300 h-332'
                    onClick={onClickImg}
                  >
                    <Image
                      width={300}
                      height={300}
                      src='error'
                      preview={false}
                      fallback='data:image/png;base64,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'
                    />
                  </div>
                  <input
                    className='hidden w-300 h-332'
                    type='file'
                    name='file'
                    ref={imgRef}
                    onChange={onChangeFile}
                  />
                </>
              )}
            </div>
            <div className='flex flex-col w-full items-center'>
              {/* <div className='w-full'> */}
              <div className='flex justify-center w-full mt-8'>
                <Row className='items-center w-full'>
                  <Col span={3} className=''>
                    <Form.Item name='priority' labelCol={{ span: 0 }}>
                      <PriorityProgressBar
                        priority={inputValue}
                        strokeWidth={4}
                        className='w-8 cursor-pointer select-none'
                        onChange={onChangePriority}
                      />
                    </Form.Item>
                  </Col>
                  {/* <Col className='flex-1 ml-6'> */}
                  <Col span={21} className='w-full'>
                    <Form.Item name='name' className='w-full'>
                      <Input
                        // size='middle'
                        placeholder='물품명 입력'
                        className='w-full h-12 border-none'
                        allowClear
                        name='name'
                        onChange={onChangeInputs}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              {/* <div className='flex justify-center w-full'> */}
              <div className='w-full'>
                <Form.Item
                  label='분류ㅤㅤ'
                  name='type'
                  colon={false}
                  // labelCol={{ span: 3 }}
                  className='w-full'
                >
                  {/* <Select
                    onChange={handleTypeChange}
                    defaultValue={'소모품'}
                    options={[
                      { value: 'CONSUMABLE', label: '소모품' },
                      { value: 'EQUIPMENT', label: '비품' },
                    ]}
                  /> */}
                  <Radio.Group
                    onChange={handleTypeChange}
                    defaultValue={'CONSUMABLE'}
                    // className='w-56'
                  >
                    <Radio value={'CONSUMABLE'}>소모품</Radio>
                    <Radio value={'EQUIPMENT'}>비품</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>

              <div className='flex flex-row items-center w-full'>
                <Form.Item label='보관장소' name='roomNo' className='w-1/2' colon={false}>
                  <Select onChange={onChangeRoomsList} className='w-5/6'>
                    {roomsList?.data?.map((el: RoomsRS) => (
                      <Select.Option key={el.roomNo} value={el.roomNo}>
                        <div>{el.name}</div>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label='위치' name='placesNo' className='w-1/2 ' colon={false}>
                  <Select onChange={onChangePlaceNo} className='w-5/6'>
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
                  label='라벨ㅤㅤ'
                  // label='라벨'
                  name='labels'
                  colon={false}
                  // labelCol={{ span: 3 }}
                  className='w-full'
                >
                  <Label />
                </Form.Item>
              </div>

              {/* <div className='flex justify-center w-full'> */}
              <div className='w-full'>
                <Form.Item label='상세위치' name='locationMemo' colon={false} className='w-full'>
                  <TextArea
                    placeholder='메모'
                    rows={2}
                    className='w-full'
                    allowClear
                    name='description'
                    onChange={onChangeInputs}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <Button htmlType='submit' hidden />
        </Form>
      </Modal>
    </>
  )
}
export default CreateItemModal
