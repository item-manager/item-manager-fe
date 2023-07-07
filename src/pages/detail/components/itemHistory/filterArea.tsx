import { quantityLogState } from '@/store'
import { useForm } from 'antd/lib/form/Form'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { Form, Select, FormProps } from 'antd'

export default function FilterArea() {
  const [form] = useForm<{
    type: string
    year: number | null
    month: number
    order: string
  }>()

  const [quantityLog, setQuantityLog] = useRecoilState(quantityLogState)

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

  return (
    <>
      <Form
        form={form}
        onValuesChange={handleValuesChange}
        initialValues={{
          ...quantityLog,
          order: quantityLog.orderBy ? `${quantityLog.orderBy}${quantityLog.sort}` : undefined,
        }}
        onFinish={handleSubmit}
      >
        <section className='flex mt-14 mb-2'>
          <div className='w-6/12' />
          <div className='flex w-6/12 h-8'>
            <Form.Item name='type'>
              <Select
                style={{ width: 120 }}
                placeholder='구매/사용'
                options={[
                  { value: null, label: '구매/사용' },
                  { value: 'purchase', label: '구매' },
                  { value: 'consume', label: '사용' },
                ]}
              />
            </Form.Item>
            <Form.Item name='year'>
              <Select
                style={{ width: 120, marginLeft: 20 }}
                placeholder='년도'
                options={[
                  { value: null, label: '전체 년도' },
                  { value: 2023, label: '2023' },
                  { value: 2022, label: '2022' },
                  { value: 2021, label: '2021' },
                  { value: 2020, label: '2020' },
                  { value: 2019, label: '2019' },
                  { value: 2018, label: '2018' },
                  { value: 2017, label: '2017' },
                  { value: 2016, label: '2016' },
                  { value: 2015, label: '2015' },
                  { value: 2014, label: '2014' },
                  { value: 2013, label: '2013' },
                  { value: 2012, label: '2012' },
                  { value: 2011, label: '2011' },
                  { value: 2010, label: '2010' },
                  { value: 2009, label: '2009' },
                  { value: 2008, label: '2008' },
                  { value: 2007, label: '2007' },
                  { value: 2006, label: '2006' },
                  { value: 2005, label: '2005' },
                  { value: 2004, label: '2004' },
                  { value: 2003, label: '2003' },
                ]}
              />
            </Form.Item>
            <Form.Item name='month'>
              <Select
                style={{ width: 120, marginLeft: 20 }}
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
            <Form.Item name='order'>
              <Select placeholder='정렬' className='w-[120px] ml-5' allowClear>
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
