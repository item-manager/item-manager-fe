import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, Select } from 'antd'

const SearchArea = () => {
  return (
    <div className='flex justify-between mb-4'>
      <div className='flex gap-x-3'>
        <Input
          size='middle'
          placeholder='물품명으로 검색'
          prefix={<SearchOutlined />}
          className='w-48'
        />
        <Select placeholder='사용처 구분'>
          <Select.Option value=''>전체</Select.Option>
          <Select.Option value='1'>거실</Select.Option>
          <Select.Option value='2'>욕실</Select.Option>
        </Select>
        <Select placeholder='정렬' className='w-48'>
          <Select.Option value='1'>구매일 오래된 순</Select.Option>
          <Select.Option value='2'>보관 장소</Select.Option>
        </Select>
      </div>
      <Button type='primary'>물품 추가</Button>
    </div>
  )
}

export default SearchArea
