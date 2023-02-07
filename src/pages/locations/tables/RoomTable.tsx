import { httpClient, RoomsRS } from '@/apis'
import BasicTable from '@/components/tables/BasicTable'
import useModal from '@/hooks/useModal'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'antd'
import { ColumnsType } from 'antd/es/table'
import RoomModal from '../modals/RoomModal'

const RoomTable = ({ setRoomNo }: { setRoomNo: (roomNo: number) => void }) => {
  const { visible, showModal, hideModal } = useModal()

  const query = useQuery({
    queryKey: ['rooms'],
    queryFn: httpClient.locations.allRooms,
  })

  const columns: ColumnsType<RoomsRS> = [
    {
      title: '방',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
  ]

  return (
    <div className='flex flex-col'>
      <Button onClick={showModal} type='primary' className='mb-4 ml-auto'>
        방 추가
      </Button>
      <BasicTable<RoomsRS>
        columns={columns.map((column) => ({
          ...column,
          onCell: (record) => {
            return {
              onClick: () => {
                setRoomNo(record.roomNo!)
              },
            }
          },
        }))}
        rowKey='roomNo'
        dataSource={query.data?.data}
        loading={query.isLoading}
      />
      {visible && <RoomModal hideModal={hideModal} setRoomNo={setRoomNo} />}
    </div>
  )
}

export default RoomTable
