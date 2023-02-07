import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faUser, faEye } from '@fortawesome/free-solid-svg-icons'
import { ChangeEvent, useState } from 'react'
import { httpClient } from '@/apis'
import { useNavigate } from 'react-router'
import { NavigationUtil } from '@/utils'
import { useRecoilState } from 'recoil'
import { showPassword } from '@/store/atom'

const LoginPage = () => {
  const navigate = useNavigate()
  const [isShow, setIsShow] = useRecoilState(showPassword)
  const [inputs, setInputs] = useState({
    id: '',
    password: '',
  })

  const onChangeInputs = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputs({
      ...inputs,
      [event.target.name]: event.target.value,
    })
  }

  const onClickShowPass = (): void => {
    setIsShow((prev) => !prev)
  }

  const onClickLogin = async () => {
    const { id, password } = inputs
    if (!id || !password) return alert('정보를 입력해 주세요')
    try {
      await httpClient.auth.login({ ...inputs })
    } catch (error) {
      if (error instanceof Error) console.log(error.message)
    }
  }

  const onClickMoveToRegister = () => {
    navigate(NavigationUtil.register)
  }

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-bkg'>
      <div className='w-518 h-471 bg-white shadow-1 flex flex-col items-center justify-evenly rounded-lg'>
        <h1 className='w-72 h-10 font-bold text-3xl flex items-center justify-center'>
          물품관리서비스 <span className='text-main pl-2'>로그인</span>
        </h1>
        <h3 className='w-210 h-4 text-xs text-gray text-center'>
          물품관리서비스로 물품을 관리하세요 {':)'}
        </h3>
        <div>
          <input
            placeholder='ID'
            className='w-72 h-10 pl-3 outline-none border-b-2 bg-white'
            name='id'
            onChange={onChangeInputs}
          />
          <FontAwesomeIcon icon={faUser} className='relative right-6' />
        </div>
        <div>
          <input
            placeholder='Password'
            type={isShow ? 'text' : 'password'}
            className='w-72 h-10 pl-3 outline-none border-b-2'
            name='password'
            onChange={onChangeInputs}
          />
          {isShow ? (
            <FontAwesomeIcon
              icon={faEye}
              className='relative right-6 cursor-pointer'
              onClick={onClickShowPass}
            />
          ) : (
            <FontAwesomeIcon
              icon={faEyeSlash}
              className='relative right-6 cursor-pointer'
              onClick={onClickShowPass}
            />
          )}
        </div>
        <button
          className='w-430 h-46 flex items-center justify-center bg-main rounded-md hover:opacity-95'
          onClick={onClickLogin}
        >
          LOGIN
        </button>
        <div className='text-xs text-gray text-center'>
          아직 회원이 아니신가요?
          <span
            className='text-main cursor-pointer hover:opacity-95 pl-1'
            onClick={onClickMoveToRegister}
          >
            회원가입
          </span>
        </div>
      </div>
    </div>
  )
}
export default LoginPage
