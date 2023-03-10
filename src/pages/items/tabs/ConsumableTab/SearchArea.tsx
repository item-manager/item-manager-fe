import { httpClient } from '@/apis'
import { consumableSearchState } from '@/store'
import { SearchOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Form, FormProps, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

const SearchArea = () => {
  const [form] = useForm<{
    labels: string[]
    name: string
    order: string
  }>()

  const [consumableSearch, setConsumableSearch] = useRecoilState(consumableSearchState)

  useEffect(() => form.resetFields(), [form, consumableSearch])

  const getLabelsQuery = useQuery(['labels'], httpClient.labels.getLabels, {
    select({ data }) {
      return (
        data?.map((item) => ({
          value: item.labelNo?.toString(),
          label: item.name,
        })) || []
      )
    },
  })

  const handleValuesChange: FormProps['onValuesChange'] = (changedValues) => {
    if (!changedValues.name) {
      setSearchValue()
    }
  }

  const handleSubmit: FormProps['onFinish'] = () => {
    setSearchValue()
  }

  const setSearchValue = () => {
    const { order, ...rest } = form.getFieldsValue()

    const matchedValue = order?.match(/(.+)([+-])/) as [
      never,
      'priority' | 'quantity' | 'latest_purchase_date' | 'latest_consume_date',
      '+' | '-'
    ]

    let orderBy: 'priority' | 'quantity' | 'latest_purchase_date' | 'latest_consume_date',
      sort: '+' | '-'

    if (matchedValue) {
      orderBy = matchedValue[1]
      sort = matchedValue[2]
    }

    setConsumableSearch((data) => ({ ...data, ...rest, orderBy, sort, page: 1 }))
  }

  return (
    <div className='flex flex-wrap justify-between mb-4'>
      <Form
        form={form}
        onValuesChange={handleValuesChange}
        initialValues={{
          ...consumableSearch,
          order: consumableSearch.orderBy
            ? `${consumableSearch.orderBy}${consumableSearch.sort}`
            : undefined,
        }}
        onFinish={handleSubmit}
      >
        <div className='flex flex-wrap gap-x-3'>
          <Form.Item name='name'>
            <Input
              size='middle'
              placeholder='??????????????? ??????'
              prefix={<SearchOutlined />}
              className='w-48'
              allowClear
            />
          </Form.Item>
          <Form.Item name='labels'>
            <Select<string[]>
              className='min-w-[100px]'
              allowClear
              mode='tags'
              placeholder='?????? ??????'
              options={getLabelsQuery.data}
              loading={getLabelsQuery.isLoading}
              optionFilterProp='label'
            />
          </Form.Item>
          <Form.Item name='order'>
            <Select placeholder='??????' className='w-48' allowClear>
              <Select.Option value='priority+'>????????? ????????????</Select.Option>
              <Select.Option value='priority-'>????????? ????????????</Select.Option>
              <Select.Option value='quantity+'>?????? ?????? ????????????</Select.Option>
              <Select.Option value='quantity-'>?????? ?????? ????????????</Select.Option>
              <Select.Option value='latest_purchase_date+'>????????? ????????????</Select.Option>
              <Select.Option value='latest_purchase_date-'>????????? ????????????</Select.Option>
              <Select.Option value='latest_consume_date+'>????????? ????????????</Select.Option>
              <Select.Option value='latest_consume_date-'>????????? ????????????</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <button type='submit' className='hidden'></button>
      </Form>
      <Button type='primary' className='ml-auto'>
        ?????? ??????
      </Button>
    </div>
  )
}

export default SearchArea
