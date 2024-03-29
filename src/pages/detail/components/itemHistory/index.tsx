import { Button, message, Modal, PaginationProps, Tooltip } from 'antd'
import BasicTable from '@/components/tables/BasicTable'
import { useRecoilState } from 'recoil'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { httpClient, QuantityLogsRQ, QuantityLogsRS } from '@/apis'
import { useParams } from 'react-router'
import { quantityLogState } from '@/store'
import FilterArea from './filterArea'
import { DeleteFilled, EllipsisOutlined } from '@ant-design/icons'
import LineChart from './lineChart'
import { useEffect } from 'react'
import useModal from '@/hooks/useModal'
import PurchaseModal from '@/components/modals/PurchaseModal'
import ItemUseModal from '@/components/modals/ItemUseModal'

const ItemHistory = () => {
  const { itemNo } = useParams()

  const getItemQuery = useQuery(['items', itemNo], () => httpClient.items.getItem(Number(itemNo)))

  const [quantityLog, setQuantityLog] = useRecoilState(quantityLogState)

  const { visible, showModal, hideModal, isItemUse, showItemUseModal, hideItemUseModal } =
    useModal()
  const [modal, contextHolder] = Modal.useModal()

  const queryClient = useQueryClient()

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

  const columns: any = [
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
      width: 130,
      render(value: string) {
        return value.split('T')[0]
      },
    },
    {
      title: '수량',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 80,
      render(value: number, record: { count: number }) {
        return record.count
      },
    },
    {
      title: '단위금액',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      align: 'center',
      width: 100,
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
      width: 100,
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
      <FilterArea />
      <section className='h-full flex'>
        <div id='left-section' className='w-6/12 flex justify-center'>
          <LineChart
            allPurchase={allPurchase}
            allConsume={allConsume}
            initialYear={initialYear}
            initialType={initialType}
            allPurchaseYears={allPurchaseYears}
            allConsumeYears={allConsumeYears}
          />
        </div>
        <div id='right-section' className='w-6/12'>
          <BasicTable<QuantityLogsRS>
            columns={columns}
            dataSource={query.data?.data}
            pagination={{
              current: quantityLog.page,
              pageSize: quantityLog.size,
              total: query?.data?.page?.totalDataCnt,
              onChange: handlePageChange,
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
      </section>
    </>
  )
}
export default ItemHistory
