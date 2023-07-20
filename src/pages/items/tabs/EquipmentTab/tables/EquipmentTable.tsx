import { EquipmentItemRS, EquipmentItemsRQ, httpClient, ItemRS, ITEM_TYPE } from '@/apis'
import { PriorityProgressBar } from '@/components/progress'
import BasicTable from '@/components/tables/BasicTable'
import { equipmentSearchState } from '@/store'
import { DeleteFilled, EllipsisOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, message, Modal, PaginationProps, Tag, Tooltip, Descriptions } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons'

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

  // row 확장
  const [expended, setExpended] = useState(0)
  const expend = (itemNo: number) => {
    if (expended === itemNo) setExpended(0)
    else setExpended(itemNo)
  }
  const expandedRowRender = (record: EquipmentItemRS) => {
    return (
      <div className='lg:w-3/4 mx-auto'>
        <div className='flex flex-wrap gap-x-2 mb-[18px]'>
          <div className='flex items-center'>
            <div className='w-5'>
              <PriorityProgressBar priority={record.priority} />
            </div>
          </div>
          <div className='flex items-center'>
            <div className='font-medium text-lg'>{record.name}</div>
          </div>
        </div>
        <Descriptions>
          <Descriptions.Item label='장소'>{record.roomName}</Descriptions.Item>
          <Descriptions.Item label='위치'>{record.placeName}</Descriptions.Item>
          <Descriptions.Item label='라벨' className='md:min-w-[120px]'>
            <div className='inline-flex flex-wrap gap-y-2'>
              {record.labels?.map((item) => (
                <Tag key={item.labelNo} color='default'>
                  {item.name}
                </Tag>
              ))}
            </div>
          </Descriptions.Item>
        </Descriptions>
        <div className='grid justify-end mt-2 lg:hidden'>
          <Tooltip title='삭제'>
            <Button
              type='text'
              shape='circle'
              icon={<DeleteFilled className='text-stone-500' />}
              className='flex items-center justify-center'
              onClick={(e) => {
                deleteItem(record)
              }}
            />
          </Tooltip>
        </div>
      </div>
    )
  }
  // row 확장

  const columns: ColumnsType<EquipmentItemRS> = [
    {
      align: 'center',
      render: (_value, record, _index) => {
        return (
          <Button
            type='text'
            shape='circle'
            icon={
              <FontAwesomeIcon
                icon={expended === record.itemNo ? faAngleDown : faAngleRight}
                className='text-lg text-emerald-900'
              />
            }
            className='flex items-center justify-center'
            onClick={(e) => {
              e.stopPropagation()
              expend(record.itemNo)
            }}
          />
        )
      },
      onCell: (record, rowIndex) => {
        return {
          onClick: (e) => e.stopPropagation(),
        }
      },
    },
    {
      title: '중요도',
      dataIndex: 'priority',
      key: 'priority',
      align: 'center',
      // colSpan: 0,
      render: (priority) => {
        return (
          <div className='w-5 mx-auto'>
            <PriorityProgressBar priority={priority} />
          </div>
        )
      },
      // width: 80,
    },
    {
      title: '물품명',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      // colSpan: 2,
      // width: 200,
    },
    {
      title: '라벨',
      dataIndex: 'labels',
      key: 'labels',
      align: 'center',
      responsive: ['lg'],
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
      // width: 200,
    },
    {
      title: '장소',
      dataIndex: 'roomName',
      key: 'roomName',
      align: 'center',
      // width: 100,
    },
    {
      title: '위치',
      dataIndex: 'placeName',
      key: 'placeName',
      align: 'center',
      responsive: ['sm'],
      // width: 200,
    },
    {
      title: <EllipsisOutlined />,
      key: '...',
      align: 'center',
      responsive: ['lg'],
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
      // width: 70,
    },
  ]

  const handlePageChange: PaginationProps['onChange'] = (page, _pageSize) => {
    setEquipmentSearch((value) => ({ ...value, page }))
  }

  return (
    <>
      <BasicTable<EquipmentItemRS>
        id='item-table'
        columns={columns}
        rowKey='itemNo'
        dataSource={query.data?.data}
        loading={query.isLoading}
        tableLayout='auto'
        // tableLayout='fixed'
        // scroll={{ x: 250 }}
        scroll={{ y: window.innerHeight * 0.5 }}
        size='large'
        pagination={{
          current: equipmentSearch.page,
          pageSize: equipmentSearch.size,
          total: query.data?.page?.totalDataCnt,
          onChange: handlePageChange,
          // showSizeChanger: true,
        }}
        onRow={(data) => {
          return {
            onClick: () => navigate(`/items/${data.itemNo}`),
          }
        }}
        expandable={{
          expandedRowRender,
          showExpandColumn: false,
          expandedRowKeys: [expended],
        }}
      />
      {contextHolder}
    </>
  )
}

export default EquipmentTable
