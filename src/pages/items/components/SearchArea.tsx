import { SearchOutlined } from '@ant-design/icons'
import { Button, Form, FormInstance, Input, Select } from 'antd'

type Props = {
  form: FormInstance<SearchAreaForm>
}

export type SearchAreaForm = {
  name?: string
  temp1?: string
  order?: string
}

const SearchArea = ({ form }: Props) => {
  return (
    <div className='flex flex-wrap justify-between mb-4'>
      <Form form={form}>
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
          <Form.Item name='temp1'>
            <Select placeholder='사용처 구분' allowClear>
              <Select.Option value='거실'>거실</Select.Option>
              <Select.Option value='욕실'>욕실</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name='order'>
            <Select placeholder='정렬' className='w-48' allowClear>
              <Select.Option value='1'>구매일 오래된 순</Select.Option>
              <Select.Option value='2'>보관 장소</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
      <Button type='primary' className='ml-auto'>
        물품 추가
      </Button>
    </div>
  )
}

export default SearchArea
