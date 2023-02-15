import { httpClient, ItemRS } from '@/apis'
import { PriorityProgressBar } from '@/components/progress'
import BasicTable from '@/components/tables/BasicTable'
import { DeleteFilled, EllipsisOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Tag, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { SearchAreaForm } from '../SearchArea'

// TODO
const TYPE = 'CONSUMABLE'

const ConsumableTable = ({ name, labels }: SearchAreaForm) => {
  const query = useQuery({
    queryKey: ['items'],
    queryFn: () => httpClient.items.getItems(),
    select(data) {
      // TODO
      // @ts-ignore
      return data.data
        .map((item) => ({
          ...item,
          temp2: '2022.10.01',
          temp3: '2022.10.01',
        }))
        .filter((item) => {
          let result = true

          // TODO
          result = result && item.type === 'CONSUMABLE'

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
    // TODO 최근 구매일
    {
      title: '최근 구매일',
      dataIndex: 'temp2',
      key: 'temp2',
      align: 'center',
      width: 120,
    },
    // TODO 최근 사용일
    {
      title: '최근 사용일',
      dataIndex: 'temp3',
      key: 'temp3',
      align: 'center',
      width: 120,
    },
    {
      title: '남은 수량',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 100,
      render(_value, record) {
        return `${record.quantity?.toLocaleString() || 0}개`
      },
    },

    {
      title: '사용하기',
      key: '사용하기',
      align: 'center',
      render(_value, _record, _index) {
        return <Button type='primary'>1개 사용</Button>
      },
      width: 100,
    },
    {
      title: '구매',
      key: '구매',
      align: 'center',
      render(_value, _record, _index) {
        return <Button type='primary'>구매</Button>
      },
      width: 100,
    },
    {
      title: <EllipsisOutlined />,
      key: '구매',
      align: 'center',
      render(_value, _record, _index) {
        return (
          <Tooltip title='삭제'>
            <Button
              type='text'
              shape='circle'
              icon={<DeleteFilled className='text-stone-500' />}
              className='flex items-center justify-center py-0 mx-auto'
            />
          </Tooltip>
        )
      },
      width: 70,
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

export default ConsumableTable
