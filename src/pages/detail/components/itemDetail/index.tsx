// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faTrashCan, faLeftLong } from '@fortawesome/free-solid-svg-icons'
import { Button, Tag, Image, Modal, message } from 'antd'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/apis'
import {
  CreateItemRS,
  // , ItemRS, ResultItemRS
} from '@/apis/Api'
import { useNavigate } from 'react-router'
import { LabelRS } from '@/apis'
// import ItemEditModal from './modal/itemEditModal'
import useModal from '@/hooks/useModal'
import { v4 as uuidv4 } from 'uuid'
// import { NavigationUtil } from '@/utils'
import PurchaseModal from '@/components/modals/PurchaseModal'
import ItemUseModal from '@/components/modals/ItemUseModal'
import { PictureOutlined } from '@ant-design/icons'

const ItemDetail = () => {
  const { itemNo }: CreateItemRS = useParams()

  // const navigate = useNavigate()

  const { data: itemDetail } = useQuery(['items'], () => httpClient.items.getItem(Number(itemNo)))

  const {
    visible,
    showModal,
    hideModal,
    // isEdit,
    // showEditModal,
    // hideEditModal,
    isItemUse,
    showItemUseModal,
    hideItemUseModal,
  } = useModal()
  const [modal, contextHolder] = Modal.useModal()

  // const onClickMovePrev = () => {
  //   navigate(NavigationUtil.items)
  // }

  // const onClickDeleteItem = () => {
  //   modal.confirm({
  //     title: '물품 삭제',
  //     content: (
  //       <>
  //         해당 물품(<b>{itemDetail?.data?.name}</b>)을 삭제하시겠습니까?
  //       </>
  //     ),
  //     onOk: async () => {
  //       await httpClient.items.deleteItem(Number(itemNo))
  //       message.success('삭제되었습니다.')
  //       navigate(NavigationUtil.items)
  //     },
  //   })
  // }

  const convertItemType = (type: string | undefined) => {
    if (type) return type === 'CONSUMABLE' ? '소모품' : '비품'
  }

  return (
    <>
      {/* <div className='flex items-center h-16'>
        <FontAwesomeIcon
          icon={faLeftLong}
          className='ml-10 text-4xl hover:cursor-pointer'
          onClick={onClickMovePrev}
        />
        <Button type='primary' className='ml-auto mr-10' onClick={showEditModal}>
          정보 수정
        </Button>
        <FontAwesomeIcon
          icon={faTrashCan}
          className='h-6 mr-10 hover:cursor-pointer'
          onClick={onClickDeleteItem}
        />
      </div> */}
      {/* {isEdit && <ItemEditModal hideModal={hideEditModal} itemDetail={itemDetail?.data} />} */}

      <div className='flex flex-col items-center w-full mt-6'>
        {/* <div className='md:flex md:flex-col lg:grid lg:grid-cols-2 lg:w-full 2xl:w-3/5 justify-center'> */}
        <div className='flex flex-col lg:grid lg:grid-cols-2 w-full 2xl:w-3/5 justify-center'>
          <div id='left-section' className='flex justify-center items-center w-full'>
            {itemDetail?.data?.photoUrl ? (
              <div
                className='flex justify-center items-center border rounded-md border-neutral-400'
                style={{ width: '260px', height: '260px' }}
              >
                <Image
                  // width={300}
                  // height={300}
                  width={250}
                  height={250}
                  preview={false}
                  src={itemDetail?.data?.photoUrl}
                  // rootClassName='flex justify-center'
                />
              </div>
            ) : (
              <div
                className='flex justify-center rounded-lg bg-neutral-100'
                style={{ width: '250px', height: '250px' }}
              >
                <PictureOutlined style={{ fontSize: '70px', color: 'rgb(148 163 184)' }} />
              </div>
            )}
          </div>
          <div id='right-section' className='w-full'>
            <div className='flex items-center grid grid-cols-2 w-full h-18 border-b-1 border-lightGray'>
              <div className='grid grid-cols-2 text-base'>
                <span className='inline-block text-center font-bold'>분류</span>
                <span className='inline-block text-center'>
                  {convertItemType(itemDetail?.data?.type)}
                </span>
              </div>
              <div className='grid grid-cols-2 text-base'>
                <span className='inline-block text-center font-bold'>남은 수량</span>
                <span className='inline-block text-center'>{itemDetail?.data?.quantity}</span>
              </div>
            </div>

            <div className='flex items-center grid grid-cols-2 w-full h-18 border-b-1 border-lightGray'>
              <div className='grid grid-cols-2 text-base'>
                <span className='inline-block text-center font-bold'>장소</span>
                <span className='inline-block text-center'>{itemDetail?.data?.room}</span>
              </div>
              <div className='grid grid-cols-2 text-base'>
                <span className='inline-block text-center font-bold'>위치</span>
                <span className='inline-block text-center'>{itemDetail?.data?.place}</span>
              </div>
            </div>

            <div
              className='flex items-center grid grid-cols-4 w-full border-b-1 border-lightGray'
              style={{ minHeight: '70px' }}
            >
              <span className='inline-block text-center font-bold text-base'>라벨</span>
              <div className='flex flex-row flex-wrap items-center col-span-3 w-full'>
                {itemDetail?.data?.labels?.map((label: LabelRS) => (
                  <span key={uuidv4()} className=''>
                    <Tag color='default' className='ml-1 mt-1 mb-1 border-1'>
                      {label.name}
                    </Tag>
                  </span>
                ))}
              </div>
            </div>

            <div
              className='items-center grid grid-cols-4 w-full min-h-18 border-b-1 border-lightGray'
              style={{ minHeight: '70px' }}
            >
              <span className='inline-block text-center font-bold'>메모</span>
              <div className='col-span-3 mt-2'>
                <pre className=''>{itemDetail?.data?.memo}</pre>
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full 2xl:w-3/5 justify-end'>
          <div className='flex items-center justify-center w-full lg:w-1/2 mt-6'>
            <Button type='primary' className='h-10 text-base w-16 mr-9' onClick={showModal}>
              구매
            </Button>
            <Button type='primary' className='h-10 text-base w-16' onClick={showItemUseModal}>
              사용
            </Button>
          </div>
        </div>
      </div>
      {visible && <PurchaseModal itemNo={itemNo!} hideModal={hideModal} />}
      {isItemUse && <ItemUseModal itemNo={itemNo!} hideModal={hideItemUseModal} />}
      {/* {contextHolder} */}
    </>
  )
}
export default ItemDetail
