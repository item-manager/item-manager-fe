import { httpClient } from '@/apis'
import { SearchOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Form, FormProps, Input, Select, TreeSelect } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { useForm } from 'antd/lib/form/Form'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { equipmentSearchState, EquipmentSearchType } from './store'

const SearchArea = () => {
  const [form] = useForm<EquipmentSearchType>()

  const [equipmentSearch, setEquipmentSearch] = useRecoilState(equipmentSearchState)

  useEffect(() => form.resetFields(), [form, equipmentSearch])

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
    onSuccess: async ({ data }) => {
      if (data) {
        const newData = await Promise.all(
          data.map(async (item) => {
            const parent = {
              id: item.roomNo,
              pId: 0,
              value: item.roomNo,
              title: item.name,
              isLeaf: false,
            }

            const { data } = await httpClient.locations.getPlacesByRoomNo({ roomNo: parent.id })
            if (data) {
              const children = data.map((item) => ({
                value: item.placeNo,
                title: item.name,
                isLeaf: true,
                pId: parent.id,
              }))

              return [parent, ...children]
            } else {
              return [parent]
            }
          })
        )

        setTreeData(newData.flat())
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
    setEquipmentSearch((data) => ({ ...data, ...form.getFieldsValue(), page: 1 }))
  }

  return (
    <div className='flex flex-wrap justify-between mb-4'>
      <Form
        form={form}
        initialValues={{
          ...equipmentSearch,
        }}
        onValuesChange={handleValuesChange}
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
          <Form.Item name='locationNo'>
            <TreeSelect
              treeDataSimpleMode
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder='보관 장소'
              // loadData={onLoadData}
              treeData={treeData}
              loading={!allRoomsQuery.isError && treeData.length === 0}
              allowClear
              dropdownMatchSelectWidth={200}
            />
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
