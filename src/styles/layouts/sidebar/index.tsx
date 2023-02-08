const Sidebar = () => {
  return (
    <div className='absolute top-0 z-10 w-80 h-screen bg-bkg flex flex-col items-center justify-center'>
      {new Array(5).fill(1).map((index) => (
        <div
          key={index}
          className='w-64 h-28 bg-white shadow-2 rounded-lg m-2 hover:cursor-pointer'
        >
          <div className='p-4 text-base'>휴지 1롤</div>
          <div className='w-11/12 border-1 m-auto border-lightGray' />
          <div className='flex items-center justify-between h-14'>
            <div className='pl-4 text-main'>태그</div>
            <div className='pr-4'>1개 남았어요!</div>
          </div>
        </div>
      ))}
    </div>
  )
}
export default Sidebar
