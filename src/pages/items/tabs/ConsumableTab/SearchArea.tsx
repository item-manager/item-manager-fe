import { httpClient } from '@/apis'
import { SearchOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Form, FormProps, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useRecoilState } from 'recoil'
import { consumableSearchState, ConsumableSearchType } from './store'

const SearchArea = () => {
  const [form] = useForm<ConsumableSearchType>()

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
      setConsumableSearch(form.getFieldsValue())
    }
  }

  const handleSubmit: FormProps['onFinish'] = () => {
    setConsumableSearch(form.getFieldsValue())
  }

  return (
    <div className='flex flex-wrap justify-between mb-4'>
      <Form
        form={form}
        onValuesChange={handleValuesChange}
        initialValues={consumableSearch}
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
          <Form.Item name='orderBy'>
            <Select placeholder='정렬' className='w-48' allowClear>
              <Select.Option value='PRIORITY'>중요도</Select.Option>
              <Select.Option value='QUANTITY'>남은 수량</Select.Option>
              <Select.Option value='LATEST_PURCHASE_DATE'>최근 구매일</Select.Option>
              <Select.Option value='LATEST_CONSUME_DATE'>최근 사용일</Select.Option>
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
