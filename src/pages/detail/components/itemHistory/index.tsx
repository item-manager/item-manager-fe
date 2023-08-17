import { Button, message, Modal, PaginationProps, Tooltip, Descriptions } from 'antd'
import BasicTable from '@/components/tables/BasicTable'
import { useRecoilState } from 'recoil'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { httpClient, QuantityLogsRQ, QuantityLogsRS } from '@/apis'
import { useParams } from 'react-router'
import { quantityLogState } from '@/store'
import FilterArea from './filterArea'
import { DeleteFilled, EllipsisOutlined } from '@ant-design/icons'
import LineChart from './lineChart'
import { useEffect, useState } from 'react'
import useModal from '@/hooks/useModal'
import PurchaseModal from '@/components/modals/PurchaseModal'
import ItemUseModal from '@/components/modals/ItemUseModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import dateUtil from '@/utils/dateUtil'
import { ColumnsType } from 'antd/es/table'

const ItemHistory = () => {
  const { itemNo } = useParams()

  const getItemQuery = useQuery(['items', itemNo], () => httpClient.items.getItem(Number(itemNo)))

  const [quantityLog, setQuantityLog] = useRecoilState(quantityLogState)

  const { visible, showModal, hideModal, isItemUse, showItemUseModal, hideItemUseModal } =
    useModal()
  const [modal, contextHolder] = Modal.useModal()

  const queryClient = useQueryClient()

  const [expended, setExpended] = useState(0)

  const searchParams = new URLSearchParams(window.location.search)
  const initialType = searchParams.get('type')
  const initialYear = searchParams.get('year')

  const criteria: QuantityLogsRQ = {
    itemNo: Number(itemNo),
    type: quantityLog.type || undefined,
    year: quantityLog.year || null,
    month: quantityLog.month || undefined,
    // orderBy: quantityLog.orderBy || undefined,
    // sort: quantityLog.sort || null,
    orderBy: quantityLog.orderBy || 'date',
    sort: quantityLog.sort || '-',
    page: quantityLog.page,
    size: quantityLog.size,
  }

  const query = useQuery({
    queryKey: ['itemDetail', criteria],
    queryFn: () => httpClient.quantity.quantityLog(criteria),
    onSuccess({ page }: any) {
      const { requestPage, totalPages } = page

      if (totalPages !== 0 && totalPages < requestPage) {
        setQuantityLog((value: any) => ({ ...value, page: totalPages }))
      }
    },
  })

  const { data: chartData, refetch } = useQuery<any>({
    queryKey: ['itemDetail'],
    queryFn: () =>
      httpClient.quantity.quantitySum({
        itemNo: Number(itemNo),
        type: initialType === 'null' ? null : JSON.parse(initialType || 'null'),
        year: initialYear === 'null' ? null : JSON.parse(initialYear || 'null'),
      }),
  })

  const allPurchase = chartData?.data?.logSumByType.PURCHASE?.map((el: { sum: number }) => el.sum)

  const allConsume = chartData?.data?.logSumByType.CONSUME?.map((el: { sum: number }) => el.sum)

  const allPurchaseYears = chartData?.data?.logSumByType.PURCHASE?.map(
    (el: { date: number[] }) => el.date
  )

  const allConsumeYears = chartData?.data?.logSumByType.CONSUME?.map(
    (el: { date: number[] }) => el.date
  )

  useEffect(() => {
    refetch()
  }, [initialType, initialYear, refetch])

  if (!getItemQuery.data?.data) {
    return <></>
  }

  const handlePageChange: PaginationProps['onChange'] = (page, _pageSize) => {
    setQuantityLog((value: any) => ({ ...value, page }))
  }

  const PurchaseStatus = (status: string) => {
    switch (status) {
      case 'PURCHASE':
        return '구매'
      case 'CONSUME':
        return '사용'
      default:
        return ''
    }
  }

  const deleteLog = async (record: QuantityLogsRS) => {
    modal.confirm({
      title: `기록 삭제`,
      content: <>해당 기록을 삭제하시겠습니까?</>,
      onOk: async () => {
        await httpClient.quantity.deleteLog(record.quantityLogNo)
        queryClient.invalidateQueries({ queryKey: ['itemDetail', criteria] })
        message.success('삭제되었습니다.')
        refetch()
      },
    })
  }

  // row 확장
  const expend = (quantityLogNo: number) => {
    if (expended === quantityLogNo) setExpended(0)
    else setExpended(quantityLogNo)
  }
  const expandedRowRender = (record: QuantityLogsRS) => {
    return (
      <div className='lg:w-3/4 mx-auto'>
        <Descriptions>
          <Descriptions.Item label='구분'>{PurchaseStatus(record.type)}</Descriptions.Item>
          <Descriptions.Item label='일자'>
            {record.date && dateUtil.formatUtc(record.date, 'YYYY년 M월 D일')}
          </Descriptions.Item>
          <Descriptions.Item label='수량'>{record.count}</Descriptions.Item>
          <Descriptions.Item label='단위 금액'>{record.unitPrice}</Descriptions.Item>
          <Descriptions.Item label='금액'>{record.price}</Descriptions.Item>
          <Descriptions.Item label='구매처'>{record.mall}</Descriptions.Item>
        </Descriptions>
      </div>
    )
  }
  // row 확장

  const columns: ColumnsType<QuantityLogsRS> = [
    {
      align: 'center',
      render: (_value, record, _index) => {
        return (
          <Button
            type='text'
            shape='circle'
            icon={
              <FontAwesomeIcon
                icon={expended === record.quantityLogNo ? faAngleDown : faAngleRight}
                className='text-lg text-emerald-900'
              />
            }
            className='flex items-center justify-center'
            onClick={(e) => {
              expend(record.quantityLogNo)
            }}
          />
        )
      },
    },
    {
      title: '구분',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      // width: 100,
      render(value: string, record: { type: string }) {
        return PurchaseStatus(record.type)
      },
    },
    {
      title: '일자',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      // width: 130,
      render(value: string) {
        return value.split('T')[0]
      },
    },
    {
      title: '수량',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      // width: 80,
      render(value: number, record: { count: number }) {
        return record.count
      },
    },
    {
      title: '단위금액',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      align: 'center',
      // width: 100,
      responsive: ['md'],
      render(value: number, record: { unitPrice: number }) {
        return record.unitPrice
          ? record.unitPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : null
      },
    },
    {
      title: '금액',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      // width: 100,
      responsive: ['md'],
      render(value: number, record: { price: number }) {
        return record.price ? record.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null
      },
    },
    {
      title: '구매처',
      dataIndex: 'buyer',
      key: 'buyer',
      align: 'center',
      // width: 200,
      responsive: ['md'],
      render(value: string, record: { mall: string }) {
        return record.mall
      },
    },
    {
      title: <EllipsisOutlined />,
      key: 'delete',
      align: 'center',
      render(record: QuantityLogsRS) {
        return (
          <Tooltip title='삭제'>
            <Button
              type='text'
              shape='circle'
              icon={<DeleteFilled className='text-stone-500' />}
              className='flex items-center justify-center py-0 mx-auto'
              onClick={(e) => {
                e.stopPropagation()
                deleteLog(record)
              }}
            />
          </Tooltip>
        )
      },
      // width: 70,
    },
  ]

  return (
    <>
      <div className='flex flex-wrap gap-x-4 items-end justify-end w-full pr-8'>
        <Button type='primary' className='h-9 text-base' onClick={showModal}>
          구매
        </Button>
        <Button type='primary' className='h-9 text-base' onClick={showItemUseModal}>
          사용
        </Button>
      </div>

      <div className='flex flex-col lg:grid lg:grid-cols-2 gap-x-8 w-full justify-center mt-10'>
        <div id='left-section' className='flex justify-center items-center w-full'>
          <LineChart
            allPurchase={allPurchase}
            allConsume={allConsume}
            initialYear={initialYear}
            initialType={initialType}
            allPurchaseYears={allPurchaseYears}
            allConsumeYears={allConsumeYears}
          />
        </div>
        <div id='right-section' className='w-full max-lg:mt-12'>
          <FilterArea />
          <BasicTable<QuantityLogsRS>
            columns={columns}
            rowKey='quantityLogNo'
            dataSource={query.data?.data}
            pagination={{
              current: quantityLog.page,
              pageSize: quantityLog.size,
              total: query?.data?.page?.totalDataCnt,
              onChange: handlePageChange,
            }}
            expandable={{
              expandedRowRender,
              showExpandColumn: false,
              expandedRowKeys: [expended],
            }}
          />
        </div>
        {visible && (
          <PurchaseModal
            itemNo={Number(itemNo)!}
            refetch={refetch}
            hideModal={hideModal}
            criteria={criteria}
          />
        )}
        {isItemUse && (
          <ItemUseModal
            itemNo={Number(itemNo)!}
            refetch={refetch}
            hideModal={hideItemUseModal}
            criteria={criteria}
          />
        )}
        {contextHolder}
      </div>
    </>
  )
}
export default ItemHistory
