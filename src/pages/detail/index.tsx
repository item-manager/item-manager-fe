import { httpClient } from '@/apis'
import { PriorityProgressBar } from '@/components/progress'
import { historyTab } from '@/store/history'
import { useQuery } from '@tanstack/react-query'
import { Button, Tabs, TabsProps, Typography, Modal, message } from 'antd'
import { useParams, useNavigate } from 'react-router'
import { useRecoilState } from 'recoil'
import ItemDetail from './components/itemDetail'
import ItemHistory from './components/itemHistory'
import useModal from '@/hooks/useModal'
import ItemEditModal from './components/itemDetail/modal/itemEditModal'
import { NavigationUtil } from '@/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react'

const DetailPage = () => {
  const { itemNo } = useParams()
  const { isEdit, hideEditModal, showEditModal } = useModal()
  const [modal, contextHolder] = Modal.useModal()

  const navigate = useNavigate()

  const { data: itemDetail } = useQuery(['items'], () => httpClient.items.getItem(Number(itemNo)))

  const [isHistory, setIsHistory] = useRecoilState(historyTab)

  const onClickMovePrev = () => {
    navigate(NavigationUtil.items)
  }

  const [deleteHover, setDeleteHover] = useState(false)
  const [editHover, setEditHover] = useState(false)

  const onClickDeleteItem = () => {
    modal.confirm({
      title: '물품 삭제',
      content: (
        <>
          해당 물품(<b>{itemDetail?.data?.name}</b>)을 삭제하시겠습니까?
        </>
      ),
      onOk: async () => {
        await httpClient.items.deleteItem(Number(itemNo))
        message.success('삭제되었습니다.')
        navigate(NavigationUtil.items)
      },
    })
  }

  const Detail = () => (
    <div className='grid grid-cols-2'>
      <div className='block justify-self-start ml-2'>
        <Button type='link' className='flex' onClick={onClickMovePrev}>
          목록으로
        </Button>
        <Typography.Title level={2} className='flex items-center mt-2'>
          <div className='w-6 mr-2'>
            <PriorityProgressBar priority={itemDetail?.data?.priority} strokeWidth={4} />
          </div>
          {itemDetail?.data?.name}
        </Typography.Title>
      </div>
      <div className='flex justify-self-end items-end'>
        <div className='flex mr-8 grid grid-cols-2 gap-x-4'>
          <div className='w-10 h-10'>
            <FontAwesomeIcon
              icon={faPenToSquare}
              size='2xl'
              className={
                'text-emerald-900 hover:cursor-pointer hover:text-4xl' +
                (editHover ? ' fa-beat' : '')
              }
              // onMouseEnter={() => {
              //   setEditHover(true)
              // }}
              // onMouseLeave={() => {
              //   setEditHover(false)
              // }}
              onClick={showEditModal}
            />
            {isEdit && <ItemEditModal hideModal={hideEditModal} itemDetail={itemDetail?.data} />}
          </div>
          <div className='w-10 h-10'>
            <FontAwesomeIcon
              icon={faTrashCan}
              size='2xl'
              className={
                'text-emerald-900 hover:cursor-pointer hover:text-4xl' +
                (deleteHover ? ' fa-shake' : '')
              }
              onMouseEnter={() => {
                setDeleteHover(true)
              }}
              onMouseLeave={() => {
                setDeleteHover(false)
              }}
              onClick={onClickDeleteItem}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `상세정보`,
      children: <ItemDetail />,
    },
    {
      key: '2',
      label: `구매/사용기록`,
      children: <ItemHistory />,
    },
  ]

  const onChangeIsHistory = () => {
    setIsHistory((prev) => !prev)
  }

  return (
    <>
      <Detail />
      <Tabs
        activeKey={isHistory ? '2' : '1'}
        defaultActiveKey='1'
        items={items}
        onChange={onChangeIsHistory}
      />
      {contextHolder}
    </>
  )
}
export default DetailPage
