import { PaginationProps, Table, TableProps } from 'antd'
import React from 'react'

const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
  //   if (type === 'prev' || type === 'next') {
  //     const styledElement = React.Children.map(originalElement, (child) => {
  //       if (React.isValidElement(child)) {
  //         return React.cloneElement(child, {
  //           // @ts-ignore
  //           className: 'flex items-center justify-center w-full h-full',
  //         })
  //       }
  //       return child
  //     })
  //     return <div className='h-8 border rounded-md border-main'>{styledElement}</div>
  //   }

  return originalElement
}

function BasicTable<RecordType extends object>(props: TableProps<RecordType>) {
  const { pagination, ...rest } = props
  return (
    <Table<RecordType>
      pagination={{
        position: ['bottomCenter'],
        itemRender: itemRender,
        ...pagination,
      }}
      {...rest}
    />
  )
}

export default BasicTable
