import { httpClient, ItemRS } from '@/apis'
import { PriorityProgressBar } from '@/components/progress'
import BasicTable from '@/components/tables/BasicTable'
import { useQuery } from '@tanstack/react-query'
import { Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { SearchAreaForm } from '../SearchArea'

// TODO
const TYPE = 'EQUIPMENT'

const EquipmentTable = ({ name, labels }: SearchAreaForm) => {
  const query = useQuery({
    queryKey: ['items'],
    queryFn: () => httpClient.items.getItems(),
    select(data) {
      // TODO
      // @ts-ignore
      return data.data.filter((item) => {
        let result = true

        // TODO
        result = result && item.type === 'EQUIPMENT'

        if (name?.trim()) {
          result = result && !!item.name?.includes(name.trim())
        }

        if (labels?.length) {
          result =
            result &&
            labels.every((labelNo) => item.labels?.map((item) => item.labelNo).includes(+labelNo))
        }

        return result
      })
    },
  })

  const columns: ColumnsType<ItemRS> = [
    {
      title: '중요도',
      dataIndex: 'priority',
      key: 'priority',
      align: 'center',
      render: (priority) => {
        return (
          <div className='w-5 mx-auto'>
            <PriorityProgressBar priority={priority} />
          </div>
        )
      },
      width: 80,
    },
    {
      title: '물품명',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: '라벨',
      dataIndex: 'labels',
      key: 'labels',
      align: 'center',
      render(_value, record, _index) {
        return (
          <div className='inline-flex flex-wrap gap-y-2'>
            {record.labels?.map((item) => (
              <Tag key={item.labelNo} color='default'>
                {item.name}
              </Tag>
            ))}
          </div>
        )
      },
      width: 200,
    },
    {
      title: '보관 장소',
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
      size='large'
    />
  )
}

export default EquipmentTable
