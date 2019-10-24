// @flow

export function isEmail(str: string): boolean {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(str);
}

const loginRe = /^\w+$/
export function isLogin(str: string): boolean {
  return loginRe.test(str)
}

const nameRe = /^[а-яА-Яёa-zA-Z\s_]+$/
export function isName(str: string): boolean {
  const checkRe = nameRe.test(str)
  if (!checkRe) {
    return false
  }
  return str.trim().split(' ').length <= 3
}

const passwordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)((?!\W+).){6,}$/
export function isPassword(str: string): boolean {
  return str && str.trim().length > 0 // passwordRe.test(str)
}

export function minLength(str, length) {
  return str.length >= length
}

export function maxLength(str, length) {
  return str.length <= length
}

