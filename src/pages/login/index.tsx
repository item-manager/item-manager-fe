import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faUser, faEye } from '@fortawesome/free-solid-svg-icons'
import { ChangeEvent, KeyboardEvent, MutableRefObject, useEffect, useRef, useState } from 'react'
import { LoginUserRQ, httpClient } from '@/apis'
import { useNavigate } from 'react-router'
import { NavigationUtil } from '@/utils'
import { useRecoilState } from 'recoil'
import { showPassword } from '@/store/atom'
import { userState } from '@/store/user'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { message } from 'antd'

const LoginPage = () => {
  const focusRef = useRef() as MutableRefObject<HTMLInputElement>
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isShow, setIsShow] = useRecoilState(showPassword)

  const [inputs, setInputs] = useState<LoginUserRQ>({
    id: '',
    password: '',
  })

  const [_user, setUser] = useRecoilState(userState)

  const onChangeInputs = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputs({
      ...inputs,
      [event.target.name]: event.target.value,
    })
  }

  const onClickShowPass = (): void => {
    setIsShow((prev) => !prev)
  }

  const doLogin = async (user: LoginUserRQ): Promise<void> => {
    try {
      const response = await httpClient.auth.login(user)
      setUser(response.data)
      queryClient.clear()
      NavigationUtil.items
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data.message)
      }
    }
  }

  const onClickLogin = async () => {
    const { id, password } = inputs
    if (!id || !password) return alert('정보를 입력해 주세요')

    doLogin(inputs)
  }

  const onPressEnterLogin = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onClickLogin()
    }
  }

  const onClickMoveToRegister = (): void => {
    navigate(NavigationUtil.register)
  }

  const insertSampleUser = (): void => {
    const idInput = document.getElementsByName('id').item(0) as HTMLInputElement
    const pwInput = document.getElementsByName('password').item(0) as HTMLInputElement
    idInput.value = 'sample'
    pwInput.value = 'sample'
    doLogin({ id: 'sample', password: 'sample' })
  }

  useEffect(() => {
    focusRef.current.focus()
  }, [])

  return (
    <div className='flex items-center justify-center w-screen h-screen bg-bkg'>
      <div className='flex flex-col items-center bg-white rounded-lg w-518 h-471 shadow-1 justify-evenly'>
        <h1 className='flex items-center justify-center h-10 text-3xl font-bold w-72'>
          물품관리서비스 <span className='pl-2 text-main'>로그인</span>
        </h1>
        <h3 className='h-4 text-xs text-center w-210 text-gray'>
          물품관리서비스로 물품을 관리하세요 {':)'}
        </h3>
        <div>
          <input
            placeholder='ID'
            className='h-10 pl-3 bg-white border-b-2 outline-none w-72'
            name='id'
            onChange={onChangeInputs}
            onKeyDown={onPressEnterLogin}
            ref={focusRef}
          />
          <FontAwesomeIcon icon={faUser} className='relative right-6' />
        </div>
        <div>
          <input
            placeholder='Password'
            type={isShow ? 'text' : 'password'}
            className='h-10 pl-3 border-b-2 outline-none w-72'
            name='password'
            onChange={onChangeInputs}
            onKeyDown={onPressEnterLogin}
          />
          {isShow ? (
            <FontAwesomeIcon
              icon={faEye}
              className='relative cursor-pointer right-6'
              onClick={onClickShowPass}
            />
          ) : (
            <FontAwesomeIcon
              icon={faEyeSlash}
              className='relative cursor-pointer right-6'
              onClick={onClickShowPass}
            />
          )}
        </div>
        <button
          className='flex items-center justify-center rounded-md w-430 h-46 bg-main hover:opacity-95'
          onClick={onClickLogin}
        >
          LOGIN
        </button>
        <div className='text-xs text-center text-gray'>
          아직 회원이 아니신가요?
          <span
            className='pl-1 cursor-pointer text-main hover:opacity-95'
            onClick={onClickMoveToRegister}
          >
            회원가입
          </span>
          {' / '}
          <span className='cursor-pointer text-main hover:opacity-95' onClick={insertSampleUser}>
            테스트 계정으로 로그인하기
          </span>
        </div>
      </div>
    </div>
  )
}
export default LoginPage
