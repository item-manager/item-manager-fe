import { Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import BasicTable from '@/components/tables/BasicTable'
import { columns } from './column'
import { useRecoilState } from 'recoil'
import { ascendYear, ascendMonth, ascendAmount } from '@/store/atom'
import { useCallback } from 'react'

const ItemHistory = () => {
  const [isAscendYear, setIsAscendYear] = useRecoilState(ascendYear)
  const [isAscendMonth, setIsAscendMonth] = useRecoilState(ascendMonth)
  const [isAscendAmount, setIsAscendAmount] = useRecoilState(ascendAmount)

  const onClickYear = useCallback(() => {
    setIsAscendYear((prev) => !prev)
  }, [setIsAscendYear])

  const onClickMonth = () => {
    setIsAscendMonth((prev) => !prev)
  }

  const onClickAmount = () => {
    setIsAscendAmount((prev) => !prev)
  }

  return (
    <>
      <section className='flex mt-14 mb-2'>
        <div className='w-6/12' />
        <div className='w-6/12'>
          <Button className='ml-8' onClick={onClickYear}>
            년도 <FontAwesomeIcon icon={isAscendYear ? faCaretUp : faCaretDown} className='ml-2' />
          </Button>
          <Button className='ml-4' onClick={onClickMonth}>
            월 <FontAwesomeIcon icon={isAscendMonth ? faCaretUp : faCaretDown} className='ml-2' />
          </Button>
          <Button className='ml-4' onClick={onClickAmount}>
            낮은 가격 순
            <FontAwesomeIcon icon={isAscendAmount ? faCaretUp : faCaretDown} className='ml-2' />
          </Button>
        </div>
      </section>
      <section className='h-full flex'>
        <div id='left-section' className='w-6/12 flex justify-center'>
          <div className='w-474 h-96 bg-slate-300'>picture</div>
        </div>
        <div id='right-section' className='w-6/12'>
          <BasicTable columns={columns} />
        </div>
      </section>
    </>
  )
}
export default ItemHistory
