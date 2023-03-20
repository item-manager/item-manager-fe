import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faLeftLong } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'antd'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/apis'
import { CreateItemRS } from '@/apis/Api'
import { useNavigate } from 'react-router'
import { PriorityProgressBar } from '@/components/progress'
import { LabelRS } from '@/apis'

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
          className='ml-10 text-4xl hover:cursor-pointer'
          onClick={onClickMovePrev}
        />
        <Button type='primary' className='ml-auto mr-10'>
          정보 수정
        </Button>
        <FontAwesomeIcon icon={faTrashCan} className='h-6 mr-10 hover:cursor-pointer' />
      </div>
      <h1 className='flex items-center justify-center w-6/12 p-4 text-4xl text-center'>
        <div className='mr-4 w-11'>
          <PriorityProgressBar priority={itemDetail?.data?.priority} strokeWidth={4} />
        </div>
        {itemDetail?.data?.name}
      </h1>
      <section className='flex h-full'>
        <div id='left-section' className='flex justify-center w-6/12'>
          <div className='w-300 h-332 bg-slate-300'>picture</div>
        </div>
        <div id='right-section'>
          <div className='flex items-center w-530 h-18 border-b-1 border-lightGray'>
            <div className='w-6/12 text-base'>
              <span className='inline-block w-24 text-center'>분류:</span>
              <span className='inline-block w-6/12 text-center'>{itemDetail?.data?.type}</span>
            </div>
            <div className='w-6/12 text-base'>
              <span className='inline-block w-24 text-center'>남은 수량:</span>
              <span className='inline-block w-6/12 text-center'>{itemDetail?.data?.quantity}</span>
            </div>
          </div>
          <div className='flex items-center w-530 h-18 border-b-1 border-lightGray'>
            <div className='w-6/12 text-base'>
              <span className='inline-block w-24 text-center'>보관장소:</span>
              <span className='inline-block w-6/12 text-center'>{itemDetail?.data?.room}</span>
            </div>
            <div className='w-6/12 text-base'>
              <span className='inline-block w-24 text-center'>위치:</span>
              <span className='inline-block w-6/12 text-center'>{itemDetail?.data?.place}</span>
            </div>
          </div>
          <div className='flex items-center w-530 h-18 border-b-1 border-lightGray'>
            <div className='flex items-center w-6/12 text-base'>
              <span className='inline-block w-24 text-center'>상세위치:</span>
              <span className='inline-block w-6/12 text-center truncate text-ellipsis'>
                {itemDetail?.data?.locationMemo}
              </span>
            </div>
          </div>
          <div className='flex items-center w-530 h-18 border-b-1 border-lightGray'>
            <div className='w-6/12 text-base'>
              <span className='inline-block w-24 text-center'>라벨:</span>
              <span className='inline-block w-6/12 text-center'>
                {itemDetail?.data?.labels?.map((label: LabelRS) => (
                  <span key={itemDetail?.data?.itemNo}>
                    <span className='p-1 ml-1 rounded-lg border-1'>#{label.name}</span>
                  </span>
                ))}
              </span>
            </div>
          </div>
          <div className='flex items-center justify-center mt-6 w-530'>
            <Button type='primary' className='h-10 text-base w-14 mr-9'>
              구매
            </Button>
            <Button type='primary' className='h-10 text-base w-14'>
              사용
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
export default ItemDetail
