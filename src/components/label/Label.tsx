import { httpClient } from '@/apis'
import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Input, InputRef, List, Popover, Select, SelectProps, Typography } from 'antd'
import { useEffect, useRef, useState, useCallback } from 'react'
import { atom, useRecoilState } from 'recoil'

type OptionType = {
  label: string
  value: string
}

const selectedValuesState = atom<string[]>({
  key: 'selectedValuesState',
  default: [],
})

const PopoverContent = ({
  item,
  deleteLabel,
  patchLabel,
  close,
}: {
  item: OptionType
  deleteLabel: (labelNo: string) => void
  patchLabel: (labelNo: string, name: string) => void
  close: () => void
}) => {
  const inputRef = useRef<InputRef>(null)
  const [label, setLabel] = useState(() => item.label)

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.select()
    })
  }, [])

  const handleClick = async () => {
    try {
      await deleteLabel(item.value)
      close()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div
      className='w-56 block-overlay'
      onClick={(e) => {
        e.stopPropagation()
        close()
      }}
      onKeyUp={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onBlur={(e) => e.stopPropagation()}
      onChange={(e) => e.stopPropagation()}
    >
      <div className='relative z-50' onClick={(e) => e.stopPropagation()}>
        <Input
          ref={inputRef}
          value={label}
          onChange={(e) => {
            e.stopPropagation()
            setLabel(e.target.value)
          }}
          onKeyUp={async (e) => {
            e.stopPropagation()
            switch (e.key) {
              case 'Enter':
                await patchLabel(item.value, label)
                close()
                break
              case 'Escape':
                close()
                break
            }
          }}
          onBlur={(e) => {
            e.stopPropagation()
            if (item.label !== label) {
              patchLabel(item.value, label)
            }
          }}
          className='mb-3'
        ></Input>
        <Button
          size='small'
          type='text'
          className='flex items-center'
          icon={<DeleteOutlined />}
          onClick={handleClick}
        >
          삭제
        </Button>
        {/* TODO? 색상? <Divider /> */}
      </div>
    </div>
  )
}

const PopoverMenu = ({
  item,
  deleteLabel,
  patchLabel,
}: {
  item: OptionType
  deleteLabel: (labelNo: string) => void
  patchLabel: (labelNo: string, name: string) => void
}) => {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const buttonRef = useRef<HTMLElement>(null)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <Popover
      content={
        <PopoverContent
          key={+open}
          item={item}
          deleteLabel={deleteLabel}
          close={close}
          patchLabel={patchLabel}
        />
      }
      showArrow={false}
      trigger='click'
      open={open}
      onOpenChange={handleOpenChange}
      zIndex={1051}
      getPopupContainer={() => buttonRef.current!}
      placement='bottomRight'
    >
      <Button
        ref={buttonRef}
        type='text'
        size='small'
        icon={<EllipsisOutlined className='text-stone-500' />}
        className='flex items-center justify-center mx-auto'
      />
    </Popover>
  )
}

const Dropdown = ({
  dataSource,
  createLabel,
  deleteLabel,
  patchLabel,
  focusedIndex,
}: {
  dataSource: OptionType[]
  createLabel: (name: string) => void
  deleteLabel: (labelNo: string) => void
  patchLabel: (labelNo: string, name: string) => void
  focusedIndex: number | null
}) => {
  const [selectedValues, setSelectedValues] = useRecoilState(selectedValuesState)

  const isSelected = (item: OptionType) => selectedValues.includes(item.value)

  const toggleValue = (item: OptionType) => {
    if (isSelected(item)) {
      setSelectedValues((values) => values.filter((value) => value !== item.value))
    } else {
      setSelectedValues((values) => [...values, item.value])
    }
  }

  return (
    <List<OptionType>
      size='small'
      dataSource={dataSource}
      renderItem={(item, index) =>
        item.value === '' ? (
          <List.Item
            style={
              focusedIndex === index || dataSource.length === 1
                ? { backgroundColor: '#f5f5f5' }
                : {}
            }
            className='cursor-pointer hover:bg-lightGray'
            onClick={() => createLabel(item.label)}
          >
            <span>생성 :</span> <Typography.Text className='flex-1'>{item.label}</Typography.Text>
          </List.Item>
        ) : (
          <List.Item
            style={focusedIndex === index || isSelected(item) ? { backgroundColor: '#f5f5f5' } : {}}
            className='cursor-pointer hover:bg-lightGray'
            onClick={() => {
              toggleValue(item)
            }}
          >
            <div className='flex justify-between w-full'>
              <Typography.Text className='flex-1'>{item.label}</Typography.Text>
              <div onClick={(e) => e.stopPropagation()}>
                <PopoverMenu item={item} deleteLabel={deleteLabel} patchLabel={patchLabel} />
              </div>
            </div>
          </List.Item>
        )
      }
    />
  )
}

export const Label = (props: Parameters<typeof Select<string[]>>[0]) => {
  const { onChange, value, ...rest } = props
  const [selectedValues, setSelectedValues] = useRecoilState(selectedValuesState)

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  useEffect(() => {
    setSelectedValues([...(value || [])])
  }, [])

  const [focused, setFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [fetching, setFetching] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    // Form컴포넌트와 바인딩 되었을 때 이벤트 전달
    if (typeof onChange === 'function') {
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

  const filteredData: OptionType[] =
    query.data?.filter((item) => {
      if (!searchValue?.trim()) {
        return true
      }
      return item.label.includes(searchValue)
    }) || []
  //

  if (searchValue && !filteredData.find((item) => item.label === searchValue)) {
    filteredData.unshift({ value: '', label: searchValue })
  }

  async function createLabel(name: string) {
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

  async function patchLabel(labelNo: string, name: string) {
    setFetching(true)
    try {
      const result = await httpClient.labels.patchLabel(+labelNo, { name: name.trim() })
      if (!result.data) {
        // TODO Error 핸들링
        throw new Error('TODO')
      }
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

  async function deleteLabel(labelNo: string) {
    setFetching(true)
    try {
      await httpClient.labels.deleteLabel(+labelNo)
      setSelectedValues((values) => values.filter((item) => item !== labelNo))
      await queryClient.invalidateQueries(['labels'])
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

    if (!value?.trim()) return

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
    setSelectedValues((values) => values.filter((item) => item !== value))
  }

  const handleSearch: SelectProps['onSearch'] = (value) => {
    setSearchValue(value.trim())
    setFocusedIndex(null)
  }

  // 드랍다운 영역
  const dropdownRender: SelectProps['dropdownRender'] = () => {
    return (
      <Dropdown
        dataSource={filteredData}
        createLabel={createLabel}
        deleteLabel={deleteLabel}
        patchLabel={patchLabel}
        focusedIndex={focusedIndex}
      />
    )
  }

  const handleInputKeyDown: SelectProps['onInputKeyDown'] = (e) => {
    switch (e.key) {
      case 'Enter':
        if (focusedIndex === null) {
          const optionData = filteredData.find((item) => item.value && item.label === searchValue)

          // 신규
          if (!optionData) {
            return handleSelect(searchValue, { label: searchValue })
          }

          const isSelected = selectedValues.find((value) => value === optionData.value)

          if (isSelected) {
            handleDeselect(optionData.value, optionData)
          } else {
            handleSelect(optionData.value, optionData)
          }
        } else {
          const { value, label } = filteredData[focusedIndex]

          if (!value) {
            return handleSelect(label, { value, label })
          }

          const data = selectedValues.find((item) => item === value)
          if (data) {
            handleDeselect(value, { value, label })
          } else {
            handleSelect(value, { value, label })
          }
        }
        break
      case 'ArrowUp':
        setFocusedIndex((prev) =>
          prev === null ? filteredData.length - 1 : (prev || filteredData.length) - 1
        )
        break
      case 'ArrowDown':
        setFocusedIndex((prev) => (prev === null ? 0 : (prev + 1) % filteredData.length))
        break
    }
  }

  const handleDropdownVisibleChange: SelectProps['onDropdownVisibleChange'] = (open) => {
    setFocused(open)
    setFocusedIndex(null)
  }

  // 포커싱 상태에서만 삭제아이콘 보이도록
  const removeIcon = focused ? undefined : null

  return (
    <Select<string[]>
      mode='tags'
      placeholder='라벨을 입력해 주세요.'
      options={query.data}
      loading={query.isLoading || fetching}
      disabled={query.isLoading || fetching}
      optionFilterProp='label'
      onSelect={handleSelect}
      onDeselect={handleDeselect}
      searchValue={searchValue}
      onSearch={handleSearch}
      // value={selectedValues}
      {...(query.isLoading ? {} : { value: selectedValues })}
      dropdownRender={dropdownRender}
      {...rest}
      removeIcon={removeIcon}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      onInputKeyDown={handleInputKeyDown}
    />
  )
}
