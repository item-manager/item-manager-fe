interface CreateUser {
  id: string
  username: string
  password: string
  passwordConfirm: string
}

export const NavigationUtil = {
  login: '/login',
  register: '/register',
  locations: '/locations',
} as const

export const schema = ({ id, username, password, passwordConfirm }: CreateUser) => {
  if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(username)) {
    return alert('이메일을 옳바르게 입력해주세요')
  } else if (id.length < 2 || id.length >= 10) {
    return alert('아이디는 2자 이상 10자 이하여야 합니다.')
  } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password)) {
    return alert('비밀번호는 최소6자 이상, 대/소문자1자, 숫자1자 입력이 필수입니다.')
  } else if (password.replaceAll(' ', '') !== passwordConfirm.replaceAll(' ', '')) {
    return alert('비밀번호가 동일 해야 합니다.')
  }
}
