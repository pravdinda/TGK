import React, { useState, useCallback, useEffect } from 'react'
import withStyles from 'isomorphic-style-loader/withStyles'
import { useDispatch } from 'react-redux'
import Form from 'components/form/Form/Form'
import Input, { InputType, InputColor }  from 'components/form/Input/Input'
import FormRow from 'components/form/FormRow/FormRow'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import FormRowText from 'components/form/FormRowText/FormRowText'
import FormInfo from 'components/form/FormInfo/FormInfo'
import Button from 'components/form/Button/Button'
import Checkbox from 'components/form/Checkbox/Checkbox'
import FormButtons from 'components/form/FormButtons/FormButtons'
import Popup from 'components/common/Popup/Popup'
import LoginTypes from 'components/common/LoginTypes/LoginTypes'
import ResetPassword from 'components/auth/ResetPassword/ResetPassword'
import FormError from 'components/form/FormError/FormError'
import HomeIcon from 'assets/home.svg'
import { isEmail, isPassword } from 'utils/string'
import { post, setToken, setRefreshToken } from 'utils/api'
import { loggedIn } from 'actions/auth'
import { loadUserInfo } from 'services/auth'

import s from './Login.css'


function Login() {
  const [loginType, setLoginType] = useState('phone')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [rememberMe, setRememberMe] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [showErrors, setErrorVisibility] = useState(false)

  const [resetPasswordShowed, setResetPasswordVisibility] = useState(false)

  const dispatch = useDispatch()
  
  const showResetForm = useCallback(
    () => setResetPasswordVisibility(true)
  )

  const hideResetForm = useCallback(
    () => setResetPasswordVisibility(false)
  )

  useEffect(
    () => {
      setErrors({})
      setError(null)
      setErrorVisibility(false)
    },
    [loginType]
  )

  const send = async (e) => {
    e.preventDefault()
    e.preventDefault()
    setErrorVisibility(true)
    setError(null)
    
    const errors = {}
    if (loginType === 'phone') {
      if (!phone) {
        errors.phone = 'Укажите телефон'
      }
    } else {
      if (!email) {
        errors.email = 'Укажите email'
      } else if (!isEmail(email)) {
        errors.email = 'Некорректный email'
      }
    }
    if (!isPassword(password)) {
      errors.password = 'Укажите пароль'
    }

    setErrors(errors)

    if (Object.keys(errors).length === 0) {
      setLoading(true)
      let url, data
      if (loginType === 'phone') {
        url = 'user/auth/phone'
        data = { phone: phone.replace(/\D/g, ''), password }
      } else {
        url = 'user/auth/email'
        data = { email, password }
      }

      const res = await post({ url, data })
      const { success, response, error } = await res.json()
      if (success) {
        const { access_token, refresh_token } = response
        setToken(access_token)
        setRefreshToken(refresh_token)
        await dispatch(loadUserInfo())
        await dispatch(loggedIn())
      } else {
        setError(error.description)
      }
      setLoading(false)
    }
  }

  return  (
    <div className={s.container}>
      <div className={s.icon}>
        <HomeIcon />
      </div>
      <Form title="Вход">
        <FormInfo>
          Вниманию потребителей электрической энергии!<br />
          Сайт ООО "ТГК-2 Энергосбыт" находится по адресу:<br />
          <a href="http://tgc2-energo.ru/OnlineServices">
            http://tgc2-energo.ru/OnlineServices
          </a>
        </FormInfo>
        <FormRow>
          <FormRowTitle>
            <LoginTypes selectedType={loginType} onSelect={setLoginType} />
          </FormRowTitle>
          {loginType === 'phone' ? (
            <Input 
              value={phone} 
              onChange={setPhone} 
              fullWidth 
              type={InputType.Phone} 
              color={showErrors && errors.phone && InputColor.Error}
              hint={showErrors && errors.phone}
              onHintClose={() => setErrors({ ...errors, phone: null })}
            />
          ) : (
            <Input 
              value={email} 
              onChange={setEmail} 
              fullWidth 
              type={InputType.Email} 
              color={showErrors && errors.email && InputColor.Error}
              hint={showErrors && errors.email}
              onHintClose={() => setErrors({ ...errors, email: null })}
            />
          )}
        </FormRow>
        <FormRow>
          <FormRowTitle>Пароль</FormRowTitle>
          <Input 
            value={password} 
            onChange={setPassword} 
            fullWidth 
            type={InputType.Password} 
            color={showErrors && errors.password && InputColor.Error}
            hint={showErrors && errors.password}
            onHintClose={() => setErrors({ ...errors, password: null })}
          />
          <FormRowText>
            <span 
              className={s.forgetPassword}
              onClick={showResetForm}
            >Забыли пароль?</span>
          </FormRowText>
        </FormRow>
        <FormButtons>
          <Button text="Войти" fullWidth loading={loading} onClick={send} />
        </FormButtons>
        <FormRow>
          <Checkbox checked={rememberMe} onChange={setRememberMe} name="remember">
              Запомнить меня
          </Checkbox>
        </FormRow>

        {error && <FormError>{error}</FormError>}
      </Form>
      {resetPasswordShowed && (
        <Popup onClose={hideResetForm} >
          <ResetPassword onClose={hideResetForm} />
        </Popup>
      )}
    </div>
  )
}

export default withStyles(s)(Login)