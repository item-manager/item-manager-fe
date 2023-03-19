import { httpClient } from '@/apis'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button, Form, Modal, Input, Select, Slider, Row, Col, InputNumber, message } from 'antd'
import { ChangeEvent, useState } from 'react'
import { RoomsRS, PlacesRS } from '@/apis'
import { Label, selectedValuesState } from '@/components/label/Label'
import { useRecoilState } from 'recoil'

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

  const [inputs, setInputs] = useState({
    name: '',
    description: '',
    type: '',
  })

  const { data: roomsList } = useQuery({
    queryKey: ['roomsList'],
    queryFn: async () => await httpClient.locations.allRooms(),
  })

  const { mutate } = useMutation(httpClient.items.createItem)

  const handleOk = () => {
    form.submit()
  }

  const onChangePriority = (newValue: number | null): void => {
    setInputValue(Number(newValue))
  }

  const handleTypeChange = (value: string) => {
    const { name, description } = inputs

    console.log('value:', value)

    setInputs({
      name,
      description,
      type: value,
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

  const onClickSave = async () => {
    const { name, description, type } = inputs

    if (!name || !type || !placeNo) {
      return message.error('물품 추가를 실패하셨습니다.')
    }

    try {
      mutate({
        name,
        type,
        locationNo: placeNo,
        locationMemo: description,
        priority: inputValue,
        labels: selectedValues,
      })
      message.success('물품을 추가 하셨습니다.')
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
        width={858}
        closable={false}
        footer={null}
      >
        <Form
          form={form}
          name='basic'
          className='mt-3'
          wrapperCol={{ span: 18 }}
          autoComplete='off'
        >
          <div className='flex'>
            <div className='flex items-center justify-center w-2/4'>
              <div className='w-300 h-332 bg-slate-300'>picture</div>
            </div>
            <div className='w-2/4'>
              <div className='mt-8 ml-10'>
                <Form.Item label='' name='name'>
                  <Input
                    size='middle'
                    placeholder='물품명 입력'
                    className='w-80 h-12 border-none ml-4'
                    allowClear
                    name='name'
                    onChange={onChangeInputs}
                  />
                </Form.Item>
              </div>

              <Form.Item label='중요도' name='priority'>
                <Row className='ml-4'>
                  <Col span={12}>
                    <Slider
                      min={0}
                      max={6}
                      onChange={onChangePriority}
                      value={typeof inputValue === 'number' ? inputValue : 0}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      min={0}
                      max={6}
                      style={{ margin: '0 24px' }}
                      value={inputValue}
                      onChange={onChangePriority}
                    />
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label='분류' name='type'>
                <Select
                  className='w-48 ml-6'
                  onChange={handleTypeChange}
                  options={[
                    { value: 'CONSUMABLE', label: '소모품' },
                    { value: 'EQUIPMENT', label: '비품' },
                  ]}
                />
              </Form.Item>

              <div className='flex'>
                <Form.Item label='보관장소' name='roomNo' className='w-48'>
                  <Select onChange={onChangeRoomsList} className='w-28'>
                    {roomsList?.data?.map((el: RoomsRS) => (
                      <Select.Option key={el.roomNo} value={el.roomNo}>
                        <div>{el.name}</div>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label='위치' name='placesNo' className='w-48'>
                  <Select className='w-28' onChange={onChangePlaceNo}>
                    {roomValue?.data?.map((el: PlacesRS) => (
                      <Select.Option key={el.placeNo} value={el.placeNo}>
                        <div>{el.name}</div>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <Form.Item label='상세위치' name='locationMemo'>
                <TextArea
                  placeholder='물품명으로 검색'
                  rows={4}
                  className='w-62 h-20'
                  allowClear
                  name='description'
                  onChange={onChangeInputs}
                />
              </Form.Item>

              <Form.Item label='라벨' name='labels'>
                <Label className='w-52 ml-6' />
              </Form.Item>

              <div className='flex justify-evenly items-center'>
                <Button className='w-32 h-11 bg-main text-white' onClick={onClickSave}>
                  저장
                </Button>
                <Button className='w-44 h-11 bg-main text-white'>저장 후 구매</Button>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  )
}
export default CreateItemModal
