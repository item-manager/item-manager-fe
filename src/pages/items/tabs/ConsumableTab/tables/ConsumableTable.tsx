import { ConsumableItemRS, ConsumableItemsRQ, httpClient, ITEM_TYPE } from '@/apis'
import PurchaseModal from '@/components/modals/PurchaseModal'
import { PriorityProgressBar } from '@/components/progress'
import BasicTable from '@/components/tables/BasicTable'
import useModal from '@/hooks/useModal'
import { consumableSearchState } from '@/store'
import dateUtil from '@/utils/dateUtil'
import { DeleteFilled, EllipsisOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  message,
  Modal,
  PaginationProps,
  Tag,
  Tooltip,
  Descriptions,
  Popconfirm,
} from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareMinus, faSquarePlus } from '@fortawesome/free-regular-svg-icons'
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useRecoilState } from 'recoil'

const ConsumableTable = () => {
  const [consumableSearch, setConsumableSearch] = useRecoilState(consumableSearchState)

  const [isLoading, setIsLoading] = useState(false)
  const { visible, showModal, hideModal } = useModal()
  const [modal, contextHolder] = Modal.useModal()
  const [itemNo, setItemNo] = useState<number | undefined>()

  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const criteria: ConsumableItemsRQ = {
    name: consumableSearch.name || undefined,
    labelNos: consumableSearch.labels?.map((item) => +item),
    orderBy: consumableSearch.orderBy || undefined,
    sort: consumableSearch.sort || null,
    page: consumableSearch.page,
    size: consumableSearch.size,
  }

  const query = useQuery({
    queryKey: ['items', ITEM_TYPE.CONSUMABLE, criteria],
    queryFn: () => httpClient.items.getConsumableItems(criteria),
    onSuccess({ page }) {
      const { requestPage, totalPages } = page

      // 특정 페이지의 데이터를 모두 지웠을 경우 그 전 페이지로 재조회하도록 함
      if (totalPages !== 0 && totalPages < requestPage) {
        setConsumableSearch((value) => ({ ...value, page: totalPages }))
      }
    },
  })

  // 1개 사용
  const consumeOneItem = async (record: ConsumableItemRS) => {
    const { itemNo } = record
    setIsLoading(true)

    try {
      await httpClient.items.consumeItem(itemNo, {
        count: 1,
        date: dayjs().toISOString(),
      })

      queryClient.invalidateQueries({ queryKey: ['items'] })
      message.success('사용되었습니다.')
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const openPurchaseModal = (record: ConsumableItemRS) => {
    setItemNo(record.itemNo)
    showModal()
  }

  const deleteItem = async (record: ConsumableItemRS) => {
    modal.confirm({
      title: `물품 삭제`,
      content: (
        <>
          해당 물품(<b>{record.name}</b>)을 삭제하시겠습니까?
        </>
      ),
      onOk: async () => {
        await httpClient.items.deleteItem(record.itemNo)
        queryClient.invalidateQueries({ queryKey: ['items'] })
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
  const expandedRowRender = (record: ConsumableItemRS) => {
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
          <Descriptions.Item label='남은 수량'>{record.quantity}</Descriptions.Item>
          <Descriptions.Item label='장소(방)'>{record.roomName}</Descriptions.Item>
          <Descriptions.Item label='위치(가구)'>{record.placeName}</Descriptions.Item>
          <Descriptions.Item label='최근 구매일'>
            {record.latestPurchaseDate &&
              dateUtil.formatUtc(record.latestPurchaseDate, 'YYYY년 M월 D일')}
          </Descriptions.Item>
          <Descriptions.Item label='최근 사용일'>
            {record.latestConsumeDate &&
              dateUtil.formatUtc(record.latestConsumeDate, 'YYYY년 M월 D일')}
          </Descriptions.Item>
          <Descriptions.Item label='라벨'>
            <div className='inline-flex flex-wrap gap-y-2'>
              {record.labels?.map((item) => (
                <Tag key={item.labelNo} color='default'>
                  {item.name}
                </Tag>
              ))}
            </div>
          </Descriptions.Item>
        </Descriptions>
        <div className='grid grid-cols-2 mt-2 lg:hidden'>
          <div className='flex flex-wrap gap-x-3'>
            <Popconfirm
              title={
                <>
                  <b>{record.name}</b>을/를 1개 사용하겠습니까?
                </>
              }
              onConfirm={() => consumeOneItem(record)}
              disabled={!record.quantity}
            >
              <Button
                type='text'
                shape='circle'
                icon={
                  <FontAwesomeIcon
                    icon={faSquareMinus}
                    className={'text-2xl ' + (!record.quantity ? '' : 'text-emerald-900')}
                  />
                }
                className='flex items-center justify-center lg:hidden'
                disabled={!record.quantity}
              />
            </Popconfirm>
            <Button
              type='text'
              shape='circle'
              icon={<FontAwesomeIcon icon={faSquarePlus} className='text-2xl text-emerald-900' />}
              className='flex items-center justify-center lg:hidden'
              onClick={() => openPurchaseModal(record)}
            />
          </div>
          <div className='grid justify-end'>
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
      </div>
    )
  }
  // row 확장

  const columns: ColumnsType<ConsumableItemRS> = [
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
      // title: '중요도',
      dataIndex: 'priority',
      key: 'priority',
      align: 'center',
      colSpan: 0,
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
      colSpan: 2,
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
      title: '최근 구매일',
      dataIndex: 'latestPurchaseDate',
      key: 'latestPurchaseDate',
      align: 'center',
      // width: 120,
      responsive: ['lg'],
      render: (value) => value && dateUtil.formatUtc(value, 'YYYY.MM.DD'),
    },
    {
      title: '최근 사용일',
      dataIndex: 'latestConsumeDate',
      key: 'latestConsumeDate',
      align: 'center',
      // width: 120,
      responsive: ['lg'],
      render: (value) => value && dateUtil.formatUtc(value, 'YYYY.MM.DD'),
    },
    {
      title: '수량',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      // width: 100,
      render(_value, record) {
        return `${record.quantity?.toLocaleString() || 0}개`
      },
    },

    {
      title: '사용',
      key: '사용하기',
      align: 'center',
      // responsive: ['sm'],
      render(_value, record, _index) {
        return (
          <div
            className='flex items-center justify-center'
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Button
              type='primary'
              disabled={!record.quantity}
              className='max-md:hidden'
              onClick={() => consumeOneItem(record)}
            >
              1개 사용
            </Button>
            <Popconfirm
              title={
                <>
                  <b>{record.name}</b>을/를 1개 사용하겠습니까?
                </>
              }
              onConfirm={() => consumeOneItem(record)}
              disabled={!record.quantity}
            >
              <Button
                type='text'
                shape='circle'
                icon={
                  <FontAwesomeIcon
                    icon={faSquareMinus}
                    className={'text-2xl ' + (!record.quantity ? '' : 'text-emerald-900')}
                  />
                }
                className='flex items-center justify-center md:hidden'
                disabled={!record.quantity}
              />
            </Popconfirm>
          </div>
        )
      },
      // width: 100,
    },
    {
      title: '구매',
      key: '구매',
      align: 'center',
      // responsive: ['sm'],
      render(_value, record, _index) {
        return (
          <div
            className='flex items-center justify-center'
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Button
              type='primary'
              className='max-md:hidden'
              onClick={() => openPurchaseModal(record)}
            >
              구매하기
            </Button>
            <Button
              type='text'
              shape='circle'
              icon={<FontAwesomeIcon icon={faSquarePlus} className='text-2xl text-emerald-900' />}
              className='flex items-center justify-center md:hidden'
              onClick={() => openPurchaseModal(record)}
            />
          </div>
        )
      },
      // width: 100,
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
    setConsumableSearch((value) => ({ ...value, page }))
  }

  return (
    <>
      <BasicTable<ConsumableItemRS>
        id='item-table'
        columns={columns}
        rowKey='itemNo'
        dataSource={query.data?.data}
        loading={query.isLoading || isLoading}
        tableLayout='auto'
        // tableLayout='fixed'
        // scroll={{ x: 250 }}
        size='large'
        pagination={{
          current: consumableSearch.page,
          pageSize: consumableSearch.size,
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
      {visible && <PurchaseModal itemNo={itemNo!} hideModal={hideModal} />}
      {contextHolder}
    </>
  )
}

export default ConsumableTable
