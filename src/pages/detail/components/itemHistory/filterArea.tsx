import { quantityLogState } from '@/store'
import { useForm } from 'antd/lib/form/Form'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Form, Select, FormProps } from 'antd'
import { httpClient } from '@/apis'
import { useParams } from 'react-router'

export default function FilterArea() {
  const { itemNo } = useParams()

  const [form] = useForm<{
    type: string
    year: number | null
    month: number
    order: string
  }>()

  const [quantityLog, setQuantityLog] = useRecoilState(quantityLogState)
  const [year, setYears] = useState<Date[]>([])

  useEffect(() => {
    form.resetFields()
  }, [form, quantityLog])

  const handleValuesChange: FormProps['onValuesChange'] = (changedValues: any) => {
    if (!changedValues.name) {
      setFilterArea()
    }
  }

  const setFilterArea = () => {
    const { order, ...rest } = form.getFieldsValue()

    const matchedValue = order?.match(/(.+)([+-])/) as [
      never,
      'date' | 'count' | 'price' | 'null',
      '+' | '-'
    ]

    let orderBy: 'date' | 'count' | 'price' | 'null', sort: '+' | '-'

    if (matchedValue) {
      orderBy = matchedValue[1]
      sort = matchedValue[2]
    }

    setQuantityLog((data: any) => ({ ...data, ...rest, orderBy, sort, page: 1 }))
  }

  const handleSubmit: FormProps['onFinish'] = () => {
    setFilterArea()
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await httpClient.quantity.quantityLog({
          itemNo: Number(itemNo),
          type: quantityLog.type!,
          year: quantityLog.year!,
          month: quantityLog.month!,
          orderBy: quantityLog.orderBy!,
          sort: quantityLog.sort!,
          page: 1,
          size: 10,
        })
        if (Array.isArray(result.data)) {
          const dates = result.data.map((item) => new Date(item.date))
          setYears(dates)
        } else {
          console.error('Data is not an array or is empty.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const newList = year.map((el) => el.getFullYear())
  const yearList = [...new Set(newList)]
  const yearOptions = [
    { value: null, label: '전체 년도' },
    ...yearList.map((year) => ({ value: year, label: String(year) })),
  ]

  return (
    <>
      <Form
        form={form}
        onValuesChange={handleValuesChange}
        initialValues={{
          ...quantityLog,
          order:
            quantityLog.orderBy && quantityLog.sort
              ? `${quantityLog.orderBy}${quantityLog.sort}`
              : 'date-',
        }}
        onFinish={handleSubmit}
      >
        <section className='flex mb-2'>
          <div className='flex flex-row flex-wrap gap-x-3'>
            <Form.Item name='type' className='flex'>
              <Select
                className='w-[120px]'
                placeholder='구매/사용'
                options={[
                  { value: null, label: '구매/사용' },
                  { value: 'purchase', label: '구매' },
                  { value: 'consume', label: '사용' },
                ]}
              />
            </Form.Item>
            <Form.Item name='year' className='flex'>
              <Select className='w-[120px]' placeholder='년도' options={yearOptions} />
            </Form.Item>
            <Form.Item name='month' className='flex'>
              <Select
                className='w-[120px]'
                placeholder='월'
                options={[
                  { value: null, label: '전체 월' },
                  { value: 1, label: '1월' },
                  { value: 2, label: '2월' },
                  { value: 3, label: '3월' },
                  { value: 4, label: '4월' },
                  { value: 5, label: '5월' },
                  { value: 6, label: '6월' },
                  { value: 7, label: '7월' },
                  { value: 8, label: '8월' },
                  { value: 9, label: '9월' },
                  { value: 10, label: '10월' },
                  { value: 11, label: '11월' },
                  { value: 12, label: '12월' },
                ]}
              />
            </Form.Item>
            <Form.Item name='order' className='flex'>
              <Select placeholder='정렬' allowClear className='w-[120px]'>
                <Select.Option value='date-'>최신 날짜</Select.Option>
                <Select.Option value='date+'>오래된 날짜</Select.Option>
                <Select.Option value='count-'>많은 수량 순</Select.Option>
                <Select.Option value='count+'>적은 수량 순</Select.Option>
                <Select.Option value='price-'>높은 가격 순</Select.Option>
                <Select.Option value='price+'>낮은 가격 순</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </section>
      </Form>
    </>
  )
}
