import { httpClient, CreateUserRQ } from '@/apis'

export const NavigationUtil = {
  login: '/login',
  register: '/register',
  locations: '/locations',
} as const

export const Schema = async ({ id, username, password, passwordConfirm }: CreateUserRQ) => {
  if (!/^[A-Za-z][A-Za-z0-9_]{2,10}$/.test(id)) {
    return alert('아이디는 최소 2글자 이상, 10글자 이하여야 합니다.')
  } else if (!/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,10}$/.test(username)) {
    return alert('닉네임은 최소 2글자 이상, 10글자 이하여야 합니다.')
  } else if (!/^(?=\w*\d)(?=\w*[a-z])(?=\w*[A-Z])\w{6,20}$/.test(password)) {
    return alert('비밀번호는 최소6자 이상, 대/소문자1자, 숫자1자 입력이 필수입니다.')
  } else if (password !== passwordConfirm) {
    return alert('비밀번호가 동일 해야 합니다.')
  }

  try {
    await httpClient.users.createUser({ id, username, password, passwordConfirm })
  } catch (error) {
    if (error instanceof Error) console.log('register error:', error.message)
  }
}
