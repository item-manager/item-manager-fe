export const Sidebar = () => {
  return (
    <div className='absolute top-0 z-10 flex flex-col items-center justify-center h-screen w-80 bg-bkg'>
      {new Array(5).fill(1).map((index) => (
        <div
          key={index}
          className='w-64 m-2 bg-white rounded-lg h-28 shadow-2 hover:cursor-pointer'
        >
          <div className='p-4 text-base'>휴지 1롤</div>
          <div className='w-11/12 m-auto border-1 border-lightGray' />
          <div className='flex items-center justify-between h-14'>
            <div className='pl-4 text-main'>태그</div>
            <div className='pr-4'>1개 남았어요!</div>
          </div>
        </div>
      ))}
    </div>
  )
}
