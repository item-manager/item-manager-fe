import { EquipmentItemRS, EquipmentItemsRQ, httpClient, ItemRS, ITEM_TYPE } from '@/apis'
import { PriorityProgressBar } from '@/components/progress'
import BasicTable from '@/components/tables/BasicTable'
import { equipmentSearchState } from '@/store'
import { DeleteFilled, EllipsisOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, message, Modal, PaginationProps, Tag, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'

const EquipmentTable = () => {
  const [equipmentSearch, setEquipmentSearch] = useRecoilState(equipmentSearchState)

  const queryClient = useQueryClient()

  const [modal, contextHolder] = Modal.useModal()

  const navigate = useNavigate()

  const criteria: EquipmentItemsRQ = {
    name: equipmentSearch.name || undefined,
    labelNos: equipmentSearch.labels?.map((item) => +item),
    page: equipmentSearch.page,
    size: equipmentSearch.size,
    locationNo: equipmentSearch.locationNo || undefined,
  }

  const query = useQuery({
    queryKey: ['items', ITEM_TYPE.EQUIPMENT, criteria],
    queryFn: () => httpClient.items.getEquipmentItems(criteria),
    onSuccess({ page }) {
      const { requestPage, totalPages } = page

      // 특정 페이지의 데이터를 모두 지웠을 경우 그 전 페이지로 재조회하도록 함
      if (totalPages !== 0 && totalPages < requestPage) {
        setEquipmentSearch((value) => ({ ...value, page: totalPages }))
      }
    },
  })

  const deleteItem = async (record: EquipmentItemRS) => {
    modal.confirm({
      title: `물품 삭제`,
      content: (
        <>
          해당 물품(<b>{record.name}</b>)을 삭제하시겠습니까?
        </>
      ),
      onOk: async () => {
        await httpClient.items.deleteItem(record.itemNo)
        await queryClient.invalidateQueries({ queryKey: ['items'] })
        message.success('삭제되었습니다.')
      },
    })
  }

  const columns: ColumnsType<EquipmentItemRS> = [
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
    {
      title: <EllipsisOutlined />,
      key: '...',
      align: 'center',
      render(_value, record, _index) {
        return (
          <Tooltip title='삭제'>
            <Button
              type='text'
              shape='circle'
              icon={<DeleteFilled className='text-stone-500' />}
              className='flex items-center justify-center py-0 mx-auto'
              onClick={(e) => {
                e.stopPropagation()
                deleteItem(record)
              }}
            />
          </Tooltip>
        )
      },
      width: 70,
    },
  ]

  const handlePageChange: PaginationProps['onChange'] = (page, _pageSize) => {
    setEquipmentSearch((value) => ({ ...value, page }))
  }

  return (
    <>
      <BasicTable<EquipmentItemRS>
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
      {contextHolder}
    </>
  )
}

export default EquipmentTable
