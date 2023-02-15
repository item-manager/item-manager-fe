import { httpClient } from '@/apis'
import { SearchOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Form, FormInstance, Input, Select, TreeSelect, TreeSelectProps } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { useState } from 'react'
import { ITEM_TYPE } from '../type'

type Props = {
  form: FormInstance<SearchAreaForm>
  type: ITEM_TYPE
}

export type SearchAreaForm = {
  name?: string
  labels?: string[]
  order?: string
  // TODO tree
}

const SearchArea = ({ form, type }: Props) => {
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

  const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>([])

  const allRoomsQuery = useQuery(['rooms'], httpClient.locations.allRooms, {
    onSuccess: ({ data }) => {
      if (data) {
        setTreeData(
          data.map((item) => ({
            id: item.roomNo,
            pId: 0,
            value: item.roomNo,
            title: item.name,
            isLeaf: false,
          }))
        )
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const onLoadData: TreeSelectProps['loadData'] = async ({ id }) => {
    const { data } = await httpClient.locations.getPlacesByRoomNo({ roomNo: id })
    if (data) {
      setTreeData(
        treeData.concat(
          data.map((item) => ({
            value: item.placeNo,
            title: item.name,
            isLeaf: true,
            pId: id,
          }))
        )
      )
    }
  }

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
          {type === 'CONSUMABLE' && (
            <Form.Item name='order'>
              <Select placeholder='정렬' className='w-48' allowClear>
                <Select.Option value='1'>구매일 오래된 순</Select.Option>
                <Select.Option value='2'>보관 장소</Select.Option>
              </Select>
            </Form.Item>
          )}
          {type === 'EQUIPMENT' && (
            <Form.Item name='tree'>
              <TreeSelect
                treeDataSimpleMode
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder='보관 장소'
                loadData={onLoadData}
                treeData={treeData}
                loading={allRoomsQuery.isLoading}
                allowClear
                dropdownMatchSelectWidth={200}
              />
            </Form.Item>
          )}
        </div>
      </Form>
      <Button type='primary' className='ml-auto'>
        물품 추가
      </Button>
    </div>
  )
}

export default SearchArea
