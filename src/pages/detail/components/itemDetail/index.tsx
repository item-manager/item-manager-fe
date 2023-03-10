import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faLeftLong } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'antd'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/apis'
import { CreateItemRS } from '@/apis/Api'
import { useNavigate } from 'react-router'

const ItemDetail = () => {
  const { itemNo }: CreateItemRS = useParams()
  const navigate = useNavigate()
  const { data: itemDetail } = useQuery(['itemDetail'], () =>
    httpClient.items.getItem(Number(itemNo))
  )

  const onClickMovePrev = () => {
    navigate(-1)
  }

  return (
    <>
      <div className='flex items-center h-16'>
        <FontAwesomeIcon
          icon={faLeftLong}
          className='text-4xl ml-10 hover:cursor-pointer'
          onClick={onClickMovePrev}
        />
        <Button type='primary' className='ml-auto mr-10'>
          정보 수정
        </Button>
        <FontAwesomeIcon icon={faTrashCan} className='h-6 mr-10 hover:cursor-pointer' />
      </div>
      <h1 className='w-6/12 text-4xl text-center p-4'>{itemDetail?.data?.name}</h1>
      <section className='h-full flex'>
        <div id='left-section' className='w-6/12 flex justify-center'>
          <div className='w-300 h-332 bg-slate-300'>picture</div>
        </div>
        <div id='right-section'>
          <div className='flex items-center w-530 h-18 border-b-1 border-lightGray'>
            <div className='text-base w-6/12'>
              <span className='inline-block w-24 text-center'>분류:</span>
              <span className='inline-block w-6/12 text-center'>{itemDetail?.data?.type}</span>
            </div>
            <div className='text-base w-6/12'>
              <span className='inline-block w-24 text-center'>라벨:</span>
              <span className='inline-block w-6/12 text-center'>
                {itemDetail?.data?.labels?.map((label) => label.name).join(', ')}
              </span>
            </div>
          </div>
          <div className='flex items-center w-530 h-18 border-b-1 border-lightGray'>
            <div className='text-base w-6/12'>
              <span className='inline-block w-24 text-center'>보관장소:</span>
              <span className='inline-block w-6/12 text-center'>{itemDetail?.data?.room}</span>
            </div>
            <div className='text-base w-6/12'>
              <span className='inline-block w-24 text-center'>위치:</span>
              <span className='inline-block w-6/12 text-center'>{itemDetail?.data?.place}</span>
            </div>
          </div>
          <div className='flex items-center w-530 h-18 border-b-1 border-lightGray'>
            <div className='flex items-center text-base w-6/12'>
              <span className='inline-block w-24 text-center'>상세위치:</span>
              <span className='inline-block w-6/12 text-center truncate text-ellipsis'>
                {itemDetail?.data?.locationMemo}
              </span>
            </div>
          </div>
          <div className='flex items-center w-530 h-18 border-b-1 border-lightGray'>
            <div className='text-base w-6/12'>
              <span className='inline-block w-24 text-center'>남은 수량:</span>
              <span className='inline-block w-6/12 text-center'>{itemDetail?.data?.quantity}</span>
            </div>
          </div>
          <div className='flex items-center justify-center w-530 mt-6'>
            <Button type='primary' className='w-14 h-10 text-base mr-9'>
              구매
            </Button>
            <Button type='primary' className='w-14 h-10 text-base'>
              사용
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
export default ItemDetail
