import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faLeftLong } from '@fortawesome/free-solid-svg-icons'
import { Button, Tag, Image, Modal, message } from 'antd'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/apis'
import { CreateItemRS } from '@/apis/Api'
import { useNavigate } from 'react-router'
import { LabelRS } from '@/apis'
import ItemEditModal from './modal/itemEditModal'
import useModal from '@/hooks/useModal'
import { v4 as uuidv4 } from 'uuid'
import { NavigationUtil } from '@/utils'
import PurchaseModal from '@/components/modals/PurchaseModal'
import ItemUseModal from '@/components/modals/ItemUseModal'

const ItemDetail = () => {
  const { itemNo }: CreateItemRS = useParams()

  const navigate = useNavigate()

  const { data: itemDetail } = useQuery(['items'], () => httpClient.items.getItem(Number(itemNo)))

  const {
    visible,
    showModal,
    hideModal,
    isEdit,
    showEditModal,
    hideEditModal,
    isItemUse,
    showItemUseModal,
    hideItemUseModal,
  } = useModal()
  const [modal, contextHolder] = Modal.useModal()

  const onClickMovePrev = () => {
    navigate(NavigationUtil.items)
  }

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

  return (
    <>
      <div className='flex items-center h-16'>
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
      </div>
      {isEdit && <ItemEditModal hideModal={hideEditModal} itemDetail={itemDetail?.data} />}
      <section className='flex flex-col items-center w-full'>
        <div id='left-section' className='flex justify-center w-full '>
          <div className='flex justify-center w-300 h-332 align-center'>
            {itemDetail?.data?.photoUrl ? (
              <img src={itemDetail?.data?.photoUrl} />
            ) : (
              <Image
                width={300}
                height={300}
                src='error'
                preview={false}
                fallback='data:image/png;base64,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'
              />
            )}
          </div>
        </div>
        <div id='right-section' className='w-full max-w-screen-lg '>
          <div className='flex items-center w-full h-18 border-b-1 border-lightGray'>
            <div className='flex justify-center w-full text-base'>
              <span className='inline-block w-24 text-center font-bold'>분류:</span>
              <span className='inline-block w-6/12 text-center'>{itemDetail?.data?.type}</span>
            </div>
            <div className='flex justify-center w-full text-base '>
              <span className='inline-block w-24 text-center font-bold'>남은 수량:</span>
              <span className='inline-block w-6/12 text-center'>{itemDetail?.data?.quantity}</span>
            </div>
          </div>
          <div className='flex items-center w-full h-18 border-b-1 border-lightGray'>
            <div className='flex justify-center w-full text-base '>
              <span className='inline-block w-24 text-center font-bold'>보관장소:</span>
              <span className='inline-block w-6/12 text-center'>{itemDetail?.data?.room}</span>
            </div>
            <div className='flex justify-center w-full text-base '>
              <span className='inline-block w-24 text-center font-bold'>위치:</span>
              <span className='inline-block w-6/12 text-center'>{itemDetail?.data?.place}</span>
            </div>
          </div>

          <div className='flex items-center w-full h-18 border-b-1 border-lightGray'>
            <div className='flex justify-center w-1/2 text-base'>
              <span className='inline-block w-24 text-center font-bold'>라벨:</span>
              <div className='w-6/12 flex items-center justify-center'>
                {itemDetail?.data?.labels?.map((label: LabelRS) => (
                  <span key={uuidv4()} className=''>
                    <Tag color='default' className='ml-1 border-1'>
                      {label.name}
                    </Tag>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className='flex items-center w-full h-18 border-b-1 border-lightGray'>
            <span className='inline-block ml-[5.5rem] w-24 text-center font-bold'>메모:</span>
            <span className='inline-block w-full text-ellipsis'>{itemDetail?.data?.memo}</span>
          </div>

          <div className='flex items-center justify-center w-full mt-6'>
            <Button type='primary' className='h-10 text-base w-16 mr-9' onClick={showModal}>
              구매
            </Button>
            <Button type='primary' className='h-10 text-base w-16' onClick={showItemUseModal}>
              사용
            </Button>
          </div>
        </div>
      </section>
      {visible && <PurchaseModal itemNo={itemNo!} hideModal={hideModal} />}
      {isItemUse && <ItemUseModal itemNo={itemNo!} hideModal={hideItemUseModal} />}
      {contextHolder}
    </>
  )
}
export default ItemDetail
