import { httpClient, PlacesRQ, PlacesRS } from '@/apis'
import BasicTable from '@/components/tables/BasicTable'
import useModal from '@/hooks/useModal'
import { isContentLoadingState } from '@/store'
import { DeleteFilled, EditOutlined, EllipsisOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, message, Space, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import PlaceModal from '../modals/PlaceModal'

const PlaceTable = ({ roomNo }: PlacesRQ) => {
  const { visible, showModal, hideModal } = useModal()
  const [record, setRecord] = useState<PlacesRS | undefined>()
  const setIsLoadingState = useSetRecoilState(isContentLoadingState)
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['rooms', roomNo],
    queryFn: () => httpClient.locations.getPlacesByRoomNo({ roomNo }),
    enabled: roomNo !== undefined,
  })

  const showCreateModal = () => {
    setRecord(undefined)
    showModal()
  }

  const showUpdateModal = (record: PlacesRS) => {
    setRecord(record)
    showModal()
  }

  const deleteRoom = async (record: PlacesRS) => {
    setIsLoadingState(true)
    try {
      const locationNo = record.placeNo

      // 1. 사용중인 물품정보 조회
      const result = await httpClient.items.getItemsInLocation({ locationNo })
      if (result.data?.length) {
        // TODO 모달이든 어떻게든 변경
        alert(
          `메시지 변경 예정\n사용 중인 물품 : ${result.data.map((item) => item.name).join(', ')}`
        )
        return
      }

      // 2. 삭제
      // TODO 에러 처리?
      await httpClient.locations.deleteLocation(locationNo)
      queryClient.invalidateQueries({ queryKey: ['rooms', roomNo] })
      message.success('삭제되었습니다.')
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoadingState(false)
    }
  }

  const columns: ColumnsType<PlacesRS> = [
    {
      title: '위치',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: <EllipsisOutlined />,
      key: 'action',
      align: 'center',
      width: 100,
      render(_value, record, _index) {
        return (
          <Space size='small'>
            <Tooltip title='수정'>
              <Button
                type='text'
                shape='circle'
                icon={<EditOutlined className='text-stone-500' />}
                className='flex items-center justify-center py-0 mx-auto'
                onClick={() => showUpdateModal(record)}
              />
            </Tooltip>
            <Tooltip title='삭제'>
              <Button
                type='text'
                shape='circle'
                icon={<DeleteFilled className='text-stone-500' />}
                className='flex items-center justify-center py-0 mx-auto'
                onClick={() => deleteRoom(record)}
              />
            </Tooltip>
          </Space>
        )
      },
    },
  ]

  return (
    <div className='flex flex-col'>
      <Button
        onClick={() => showCreateModal()}
        type='primary'
        disabled={roomNo === undefined}
        className='mb-4 ml-auto'
      >
        위치 추가
      </Button>
      <BasicTable<PlacesRS>
        columns={columns}
        rowKey='placeNo'
        dataSource={query.data?.data}
        loading={!!roomNo && query.isLoading}
      />
      {visible && (
        <PlaceModal key={roomNo} record={record} roomNo={roomNo!} hideModal={hideModal} />
      )}
    </div>
  )
}

export default PlaceTable
