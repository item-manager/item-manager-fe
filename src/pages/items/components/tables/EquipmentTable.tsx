import { httpClient, ItemRS } from '@/apis'
import BasicTable from '@/components/tables/BasicTable'
import { useQuery } from '@tanstack/react-query'
import { ColumnsType } from 'antd/es/table'

// TODO
const TYPE = 'EQUIPMENT'

const EquipmentTable = () => {
  const query = useQuery({
    queryKey: ['items'],
    queryFn: () => httpClient.items.getItems(),
    select(data) {
      // TODO
      // @ts-ignore
      return data.data.map((item) => ({ ...item, temp1: '거실' }))
    },
  })

  const columns: ColumnsType<ItemRS> = [
    {
      title: '사용처',
      dataIndex: 'temp1',
      key: 'temp1',
      align: 'center',
      width: 100,
    },
    {
      title: '물품명',
      dataIndex: '',
      key: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: '보관장소',
      dataIndex: 'room',
      key: 'room',
      align: 'center',
      width: 100,
    },
    {
      title: '위치',
      dataIndex: 'place',
      key: 'place',
      align: 'center',
      width: 100,
    },
    {
      title: '상세 위치',
      dataIndex: 'locationMemo',
      key: 'locationMemo',
      align: 'center',
      width: 300,
    },
  ]

  return (
    <BasicTable<ItemRS>
      columns={columns}
      rowKey='itemNo'
      // @ts-ignore
      dataSource={query.data}
      loading={query.isLoading}
      tableLayout='fixed'
      scroll={{ x: 250 }}
    />
  )
}

export default EquipmentTable
