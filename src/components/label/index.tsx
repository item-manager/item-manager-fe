import { httpClient } from '@/apis'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Select, SelectProps } from 'antd'
import { useEffect, useState } from 'react'

function Label(props: Parameters<typeof Select<string[]>>[0]) {
  const { onChange, value: _value, ...rest } = props
  const [selectedValues, setSelectedValues] = useState<string[]>(props.defaultValue || [])

  const [searchValue, setSearchValue] = useState('')
  const [fetching, setFetching] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (typeof onChange === 'function') {
      // console.log('onChange', selectedValues)
      onChange(selectedValues, { label: null })
    }
  }, [selectedValues, onChange])

  const query = useQuery(['labels'], httpClient.labels.getLabels, {
    select(data) {
      return (
        data.data?.map((item) => ({
          value: item.labelNo?.toString(),
          label: item.name,
        })) || []
      )
    },
  })

  async function createLabel(name: string) {
    // console.log('createLabel')
    setFetching(true)
    try {
      const result = await httpClient.labels.createLabel({ name: name.trim() })
      if (!result.data) {
        // TODO Error 핸들링
        throw new Error('TODO')
      }
      const labelNo = result.data.labelNo.toString()
      await queryClient.invalidateQueries(['labels'])

      return {
        labelNo,
        name,
      }
    } catch (e) {
      // TODO Error 핸들링
      console.error(e)
      throw e
    } finally {
      setFetching(false)
    }
  }

  const handleSelect: SelectProps['onSelect'] = async (value, _option) => {
    setSearchValue('')
    // console.log('onSelect', value, option)

    let newValue: string

    if (query.data?.find((item) => item.value === value)) {
      newValue = value
    } else {
      // 신규
      const data = await createLabel(value)
      const { labelNo } = data
      newValue = labelNo
    }

    setSelectedValues((values) => [...values, newValue])
  }

  const handleDeselect: SelectProps['onDeselect'] = async (value, _option) => {
    setSearchValue('')
    // console.log('onDeselect', value, option)
    setSelectedValues((values) => values.filter((item) => item !== value))
  }

  const handleSearch: SelectProps['onSearch'] = (value) => {
    setSearchValue(value.trim())
  }

  return (
    <Select<string[]>
      mode='tags'
      style={{ width: '100%' }}
      placeholder='라벨을 입력해 주세요.'
      options={query.data}
      loading={query.isLoading || fetching}
      optionFilterProp='label'
      onSelect={handleSelect}
      onDeselect={handleDeselect}
      searchValue={searchValue}
      onSearch={handleSearch}
      value={selectedValues}
      {...rest}
    />
  )
}

export default Label
