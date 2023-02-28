import { httpClient, RoomsRS } from '@/apis'
import BasicTable from '@/components/tables/BasicTable'
import useModal from '@/hooks/useModal'
import { isContentLoadingState } from '@/store'
import { DeleteFilled, EditOutlined, EllipsisOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, message, Space, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import RoomModal from '../modals/RoomModal'

const RoomTable = ({ setRoomNo }: { setRoomNo: (roomNo: number) => void }) => {
  const { visible, showModal, hideModal } = useModal()
  const [record, setRecord] = useState<RoomsRS | undefined>()
  const setIsLoadingState = useSetRecoilState(isContentLoadingState)
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['rooms'],
    queryFn: httpClient.locations.allRooms,
  })

  const showCreateModal = () => {
    setRecord(undefined)
    showModal()
  }

  const showUpdateModal = (record: RoomsRS) => {
    setRecord(record)
    showModal()
  }

  const deleteRoom = async (record: RoomsRS) => {
    setIsLoadingState(true)
    try {
      const locationNo = record.roomNo

      // 1. 사용중인 물품정보 조회
      const result = await httpClient.items.getItemsInLocation({ locationNo })
      if (result.data?.length) {
        // TODO 모달이든 어떻게든 변경
        alert(
          `메시지 변경 예정\n사용 중인 물품 : ${result.data.map((item) => item.name).join(', ')}`
        )
        return
      }

      // 2. 위치데이터 있는지 확인
      // TODO 위치정보를 방 조회시 미리 가지고 있을지 확인
      const placesResult = await httpClient.locations.getPlacesByRoomNo({ roomNo: locationNo })
      if (placesResult.data?.length) {
        // TODO 모달이든 어떻게든 변경
        alert('등록된 위치정보가 있어 삭제할 수 없습니다.')
        return
      }

      // 3. 삭제
      // TODO 에러 처리?
      await httpClient.locations.deleteLocation(locationNo)
      queryClient.invalidateQueries({ queryKey: ['rooms'], exact: true })
      message.success('삭제되었습니다.')
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoadingState(false)
    }
  }

  const columns: ColumnsType<RoomsRS> = [
    {
      title: '방',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      onCell: (record) => {
        return {
          onClick: () => {
            setRoomNo(record.roomNo!)
          },
        }
      },
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
      <Button onClick={() => showCreateModal()} type='primary' className='mb-4 ml-auto'>
        방 추가
      </Button>
      <BasicTable<RoomsRS>
        columns={columns}
        rowKey='roomNo'
        dataSource={query.data?.data}
        loading={query.isLoading}
      />
      {visible && <RoomModal record={record} hideModal={hideModal} setRoomNo={setRoomNo} />}
    </div>
  )
}

export default RoomTable
