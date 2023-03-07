import { EquipmentItemsRQ, httpClient, ItemRS } from '@/apis'
import { PriorityProgressBar } from '@/components/progress'
import BasicTable from '@/components/tables/BasicTable'
import { equipmentSearchState } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { PaginationProps, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'

const EquipmentTable = () => {
  const [equipmentSearch, setEquipmentSearch] = useRecoilState(equipmentSearchState)

  const navigate = useNavigate()

  const criteria: EquipmentItemsRQ = {
    name: equipmentSearch.name || undefined,
    labelNos: equipmentSearch.labels?.map((item) => +item) || [],
    page: equipmentSearch.page || 1,
    size: equipmentSearch.size || 7,
    locationNo: equipmentSearch.locationNo || undefined,
  }

  const query = useQuery({
    queryKey: ['items', criteria],
    queryFn: () => httpClient.items.getEquipmentItems(criteria),
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
      dataIndex: 'roomName',
      key: 'roomName',
      align: 'center',
      width: 100,
    },
    {
      title: '위치',
      dataIndex: 'placeName',
      key: 'placeName',
      align: 'center',
      width: 200,
    },
    {
      title: '상세 위치',
      dataIndex: 'locationMemo',
      key: 'locationMemo',
      align: 'center',
      width: 300,
    },
  ]

  const handlePageChange: PaginationProps['onChange'] = (page, _pageSize) => {
    setEquipmentSearch((value) => ({ ...value, page }))
  }

  return (
    <BasicTable<ItemRS>
      columns={columns}
      rowKey='itemNo'
      dataSource={query.data?.data}
      loading={query.isLoading}
      tableLayout='fixed'
      scroll={{ x: 250 }}
      size='large'
      pagination={{
        current: equipmentSearch.page || 1,
        pageSize: equipmentSearch.size || 7,
        total: query.data?.page?.totalDataCnt,
        onChange: handlePageChange,
        // showSizeChanger: true,
      }}
      onRow={(data) => {
        return {
          onClick: () => navigate(`/items/${data.itemNo}`),
        }
      }}
    />
  )
}

export default EquipmentTable
