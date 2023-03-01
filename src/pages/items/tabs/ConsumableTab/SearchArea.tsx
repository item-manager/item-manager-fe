import { httpClient } from '@/apis'
import { SearchOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Form, FormProps, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useRecoilState } from 'recoil'
import { consumableSearchState, ConsumableSearchType } from './store'

type SearchAreaForm = Omit<ConsumableSearchType, 'orderBy' | 'sort'> & {
  order?: `${NonNullable<ConsumableSearchType['orderBy']>}${NonNullable<
    ConsumableSearchType['sort']
  >}`
}

const SearchArea = () => {
  const [form] = useForm<SearchAreaForm>()

  const [consumableSearch, setConsumableSearch] = useRecoilState(consumableSearchState)

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
      ConsumableSearchType['orderBy'],
      ConsumableSearchType['sort']
    ]

    let orderBy: ConsumableSearchType['orderBy'], sort: ConsumableSearchType['sort']

    if (matchedValue) {
      orderBy = matchedValue[1]
      sort = matchedValue[2]
    }

    setConsumableSearch((data) => ({ ...data, ...rest, orderBy, sort }))
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
              placeholder='물품명으로 검색'
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
              placeholder='라벨 검색'
              options={getLabelsQuery.data}
              loading={getLabelsQuery.isLoading}
              optionFilterProp='label'
            />
          </Form.Item>
          <Form.Item name='order'>
            <Select placeholder='정렬' className='w-48' allowClear>
              <Select.Option value='priority+'>중요도 오름차순</Select.Option>
              <Select.Option value='priority-'>중요도 내림차순</Select.Option>
              <Select.Option value='quantity+'>남은 수량 오름차순</Select.Option>
              <Select.Option value='quantity-'>남은 수량 내림차순</Select.Option>
              <Select.Option value='latest_purchase_date+'>구매일 오름차순</Select.Option>
              <Select.Option value='latest_purchase_date-'>구매일 내림차순</Select.Option>
              <Select.Option value='latest_consume_date+'>사용일 오름차순</Select.Option>
              <Select.Option value='latest_consume_date-'>사용일 내림차순</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <button type='submit' className='hidden'></button>
      </Form>
      <Button type='primary' className='ml-auto'>
        물품 추가
      </Button>
    </div>
  )
}

export default SearchArea
