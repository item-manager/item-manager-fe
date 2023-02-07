import { httpClient, PlacesRQ } from '@/apis'
import BasicTable from '@/components/tables/BasicTable'
import useModal from '@/hooks/useModal'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'antd'
import { ColumnsType } from 'antd/es/table'
import PlaceModal from '../modals/PlaceModal'

type PlacesRS = {
  placeNo?: number
  name?: string
}

const PlaceTable = ({ roomNo }: PlacesRQ) => {
  const { visible, showModal, hideModal } = useModal()

  const query = useQuery({
    queryKey: ['rooms', roomNo],
    queryFn: () => httpClient.locations.getPlacesByRoomNo({ roomNo }),
    enabled: roomNo !== undefined,
  })

  const columns: ColumnsType<PlacesRS> = [
    {
      title: '위치',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
  ]

  return (
    <div className='flex flex-col'>
      <Button
        onClick={showModal}
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
      {visible && <PlaceModal key={roomNo} roomNo={roomNo!} hideModal={hideModal} />}
    </div>
  )
}

export default PlaceTable
