import { httpClient, ItemRS } from '@/apis'
import BasicTable from '@/components/tables/BasicTable'
import { useQuery } from '@tanstack/react-query'
import { ColumnsType } from 'antd/es/table'
import { SearchAreaForm } from '../SearchArea'

// TODO
const TYPE = 'EQUIPMENT'

const EquipmentTable = ({ name, temp1 }: SearchAreaForm) => {
  const query = useQuery({
    queryKey: ['items'],
    queryFn: () => httpClient.items.getItems(),
    select(data) {
      // TODO
      // @ts-ignore
      return data.data
        .map((item) => ({ ...item, temp1: '거실' }))
        .filter((item) => {
          let result = true

          if (name?.trim()) {
            result = result && !!item.name?.includes(name.trim())
          }

          if (temp1) {
            result = result && !!item.temp1?.includes(temp1)
          }

          return result
        })
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
      dataIndex: 'name',
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
