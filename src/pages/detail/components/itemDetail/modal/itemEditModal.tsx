import { Button, Form, Modal, Input, Select, Slider, Row, Col, InputNumber } from 'antd'
import { Label, selectedValuesState } from '@/components/label/Label'
import { ChangeEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { httpClient, PlacesRS, UpdatePlaceRQ } from '@/apis'
import { v4 as uuidv4 } from 'uuid'
import { useRecoilState } from 'recoil'

interface ItemEditProps {
  hideModal: () => void
  itemDetail?: any
}

const ItemEditModal = ({ hideModal, itemDetail }: ItemEditProps) => {
  const [selectedValues] = useRecoilState(selectedValuesState)

  const [form] = Form.useForm()

  const { TextArea } = Input

  const { itemNo } = useParams()

  const [roomValue, setRoomValue] = useState<any>()

  const [type, setType] = useState('CONSUMABLE')

  const [editLocatioNo, setEditLocationNo] = useState('')

  const { data: roomsList } = useQuery({
    queryKey: ['roomsList'],
    queryFn: async () => await httpClient.locations.allRooms(),
  })

  const labels = itemDetail?.labels?.map((el: any) => {
    return el.name
  })

  const [newDetail, setNewDetail] = useState({
    editItemName: '',
    editLocationMemo: '',
    editPhoto: '',
    editPriority: 0,
    editLabels: [],
  })

  const onChangeItemDetail = (event: any) => {
    setNewDetail({
      ...newDetail,
      [event.target.name]: event.target.value,
    })
  }

  const onChangeType = (value: string) => {
    setType(value)
  }

  const onChangeRoomValue = async (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (value) {
      const result = await httpClient.locations.getPlacesByRoomNo({ roomNo: Number(value) })
      setRoomValue(result)
    }
  }

  const onChangeRoomLocation = (value: string) => {
    setEditLocationNo(value)
  }

  const handleOk = () => {
    form.submit()
  }

  const onFinish = async () => {
    const { editItemName, editPriority, editLocationMemo } = newDetail

    try {
      await httpClient.items.patchItem(Number(itemNo), {
        name: editItemName || itemDetail?.name,
        type,
        locationNo: editLocatioNo || itemDetail?.locationNo,
        locationMemo: editLocationMemo || itemDetail?.locationMemo,
        photoName: '',
        priority: editPriority || itemDetail?.priority,
        labels: selectedValues,
      })
    } catch (error) {
      if (error instanceof Error) console.log('edit item:', error.message)
    }
    hideModal()
  }

  return (
    <>
      <Modal
        open={true}
        onOk={handleOk}
        onCancel={hideModal}
        width={858}
        okText={'수정'}
        cancelText={'닫기'}
        closable={false}
        bodyStyle={{ height: 460 }}
        centered={true}
      >
        <Form
          form={form}
          name='basic'
          className='mt-3'
          autoComplete='off'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
        >
          <div className='text-xl text-center mb-4'>물품 정보 수정</div>
          <div className='flex'>
            <div className='flex items-center justify-center w-2/4'>
              <div className='w-300 h-332 bg-slate-300'>picture</div>
            </div>
            <div className='w-2/4'>
              <div className='mt-4'>
                <Form.Item label='물품명' name='name' colon={false}>
                  <Input
                    size='middle'
                    placeholder='물품명 입력'
                    allowClear
                    name='editItemName'
                    defaultValue={itemDetail?.name}
                    onChange={onChangeItemDetail}
                  />
                </Form.Item>
              </div>

              <Form.Item label='중요도' name='priority' colon={false}>
                <Row className='ml-4'>
                  <Col span={12}>
                    <Slider min={0} max={6} value={itemDetail?.priority} />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      min={0}
                      max={6}
                      style={{ width: '102px', margin: '0 24px' }}
                      value={itemDetail?.priority}
                    />
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label='분류' name='type' colon={false}>
                <Select
                  defaultValue={itemDetail?.type}
                  options={[
                    { value: 'CONSUMABLE', label: '소모품' },
                    { value: 'EQUIPMENT', label: '비품' },
                  ]}
                  onChange={onChangeType}
                />
              </Form.Item>

              <Form.Item label='보관장소' name='roomNo' colon={false}>
                <Select defaultValue={itemDetail?.room} onChange={onChangeRoomValue}>
                  {roomsList?.data?.map((el: UpdatePlaceRQ) => (
                    <Select.Option key={uuidv4()} value={el.roomNo}>
                      <div>{el.name}</div>
                    </Select.Option>
                  ))}
                </Select>
                <input hidden />
              </Form.Item>

              <Form.Item label='위치' name='placesNo' colon={false}>
                <Select defaultValue={itemDetail?.place} onChange={onChangeRoomLocation}>
                  {roomValue?.data?.map((el: PlacesRS) => (
                    <Select.Option key={uuidv4()} value={el.placeNo}>
                      <div>{el.name}</div>
                    </Select.Option>
                  ))}
                </Select>
                <input hidden />
              </Form.Item>

              <Form.Item label='상세위치' name='locationMemo' colon={false}>
                <TextArea
                  placeholder='물품명으로 검색'
                  rows={4}
                  allowClear
                  name='editLocationMemo'
                  defaultValue={itemDetail?.locationMemo}
                  className='h-12'
                  onChange={onChangeItemDetail}
                />
              </Form.Item>

              <Form.Item label='라벨' name='labels' colon={false}>
                <Label value={labels} />
                <input defaultValue={labels} hidden />
              </Form.Item>
            </div>
          </div>
          <Button htmlType='submit' hidden />
        </Form>
      </Modal>
    </>
  )
}
export default ItemEditModal
