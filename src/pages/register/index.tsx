import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faUser, faEye, faIdCard } from '@fortawesome/free-solid-svg-icons'
import { ChangeEvent, useState } from 'react'
import { NavigationUtil, Schema } from '@/utils'
import { useRecoilState } from 'recoil'
import { showPassword, showPasswordConfirm } from '@/store/atom'
import { useNavigate } from 'react-router'

const Register = () => {
  const navigate = useNavigate()
  const [isShow, setIsShow] = useRecoilState(showPassword)
  const [isShowPass, setIsShowPass] = useRecoilState(showPasswordConfirm)
  const [inputs, setInputs] = useState({
    id: '',
    username: '',
    password: '',
    passwordConfirm: '',
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

  const onClickShowPassConfirm = (): void => {
    setIsShowPass((prev) => !prev)
  }

  const onClickRegister = () => {
    const { id, username, password, passwordConfirm } = inputs

    Schema({ ...inputs })

    if (
      (id.length > 2 || id.length < 10) &&
      (username.length > 2 || username.length < 10) &&
      (password.length > 6 || password.length < 20) &&
      password === passwordConfirm
    ) {
      alert('정상적으로 회원가입 되셨습니다.')
      navigate(NavigationUtil.login)
    }
  }

  const onClickRouteLogin = () => {
    navigate(NavigationUtil.login)
  }

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-bkg'>
      <div className='w-518 h-471 bg-white shadow-1 flex flex-col items-center justify-evenly rounded-lg'>
        <h1 className='w-80 h-10 font-bold text-3xl flex items-center justify-center'>
          물품관리서비스 <span className='text-main pl-2'>회원가입</span>
        </h1>
        <div>
          <input
            placeholder='ID'
            className='w-72 h-10 pl-3 outline-none border-b-2 bg-white'
            name='id'
            onChange={onChangeInputs}
          />
          <FontAwesomeIcon icon={faIdCard} className='relative right-6' />
        </div>
        <div>
          <input
            placeholder='Username'
            className='w-72 h-10 pl-3 outline-none border-b-2 bg-white'
            name='username'
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
        <div>
          <input
            placeholder='Password Confirm'
            type={isShowPass ? 'text' : 'password'}
            className='w-72 h-10 pl-3 outline-none border-b-2'
            name='passwordConfirm'
            onChange={onChangeInputs}
          />
          {isShowPass ? (
            <FontAwesomeIcon
              icon={faEye}
              className='relative right-6 cursor-pointer'
              onClick={onClickShowPassConfirm}
            />
          ) : (
            <FontAwesomeIcon
              icon={faEyeSlash}
              className='relative right-6 cursor-pointer'
              onClick={onClickShowPassConfirm}
            />
          )}
        </div>
        <button
          className='w-430 h-46 flex items-center justify-center bg-main rounded-md hover:opacity-95'
          onClick={onClickRegister}
        >
          REGISTER
        </button>
        <div className='text-xs text-center text-gray'>
          이미 회원이신가요?
          <span
            className='pl-1 cursor-pointer text-main hover:opacity-95'
            onClick={onClickRouteLogin}
          >
            로그인하기
          </span>
        </div>
      </div>
    </div>
  )
}
export default Register
