const MainLogo = () => {
  return (
    <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' version='1.1'>
      <defs>
        <linearGradient id='bean' x1='0' x2='1' y1='1' y2='0'>
          <stop id='stop1' stopColor='rgba(46, 139, 87, 1)' offset='0%'></stop>
          <stop id='stop2' stopColor='rgba(222, 243, 224, 1)' offset='100%'></stop>
        </linearGradient>
      </defs>
      <path
        fill='url(#bean)'
        d='M24.7,-25.3C30.1,-19.4,31.1,-9.7,30,-1.1C28.8,7.4,25.6,14.9,20.2,20.1C14.9,25.3,7.4,28.2,-0.4,28.7C-8.3,29.1,-16.6,27,-21.8,21.8C-27,16.6,-29.2,8.3,-27.9,1.3C-26.6,-5.7,-21.8,-11.4,-16.6,-17.3C-11.4,-23.1,-5.7,-29.2,2,-31.2C9.7,-33.2,19.4,-31.1,24.7,-25.3Z'
        width='100%'
        height='100%'
        transform='translate(50 50)'
        strokeWidth='0'
      ></path>
    </svg>
  )
}

export default MainLogo
