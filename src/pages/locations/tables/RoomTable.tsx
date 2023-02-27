import { httpClient, RoomsRS } from '@/apis'
import BasicTable from '@/components/tables/BasicTable'
import useModal from '@/hooks/useModal'
import { DeleteFilled, EditOutlined, EllipsisOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Space, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import RoomModal from '../modals/RoomModal'

const RoomTable = ({ setRoomNo }: { setRoomNo: (roomNo: number) => void }) => {
  const { visible, showModal, hideModal } = useModal()

  const [record, setRecord] = useState<RoomsRS | undefined>()

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

  const deleteRoom = (_record: RoomsRS) => {}

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
