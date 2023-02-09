import { httpClient, ItemRS } from '@/apis'
import BasicTable from '@/components/tables/BasicTable'
import { DeleteFilled, EllipsisOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Tag, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'

// TODO
const TYPE = 'CONSUMABLE'

const ConsumableTable = () => {
  const query = useQuery({
    queryKey: ['items'],
    queryFn: () => httpClient.items.getItems(),
    select(data) {
      // TODO
      // @ts-ignore
      return data.data.map((item) => ({
        ...item,
        temp1: '거실',
        temp2: '2022.10.01',
        temp3: '2022.10.01',
      }))
    },
  })

  const columns: ColumnsType<ItemRS> = [
    // {
    //   title: '중요도',
    //   dataIndex: 'priority',
    //   key: 'priority',
    //   align: 'center',
    // },
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
      title: '라벨',
      dataIndex: 'labels',
      key: 'labels',
      align: 'center',
      render(_value, record, _index) {
        return record.labels?.map((item) => (
          <Tag key={item.labelNo} color='default'>
            {item.name}
          </Tag>
        ))
      },
      width: 200,
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
              size='large'
              icon={<DeleteFilled className='text-stone-500' />}
              className='flex items-center justify-center mx-auto'
            />
          </Tooltip>
        )
      },
      width: 100,
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

export default ConsumableTable
