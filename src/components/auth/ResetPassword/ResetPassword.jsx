// @flow
import React, { useState } from 'react'
import withStyles from 'isomorphic-style-loader/withStyles'
import Form from 'components/form/Form/Form'
import Input, { InputType, InputColor } from 'components/form/Input/Input'
import FormRow from 'components/form/FormRow/FormRow'
import FormInfo from 'components/form/FormInfo/FormInfo'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import FormRowText from 'components/form/FormRowText/FormRowText'
import Button from 'components/form/Button/Button'
import LoginTypes from 'components/common/LoginTypes/LoginTypes'
import { isEmail, isLogin, isName, isPassword } from 'utils/string'
import SuccessIcon from 'assets/success.svg'

import { post } from 'utils/api'

import s from './ResetPassword.css'

type Props = {
  onClose?: Function,
}

function ResetPassword(props: Props) {
  const { onClose } = props
  const [loginType, setLoginType] = useState('phone')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState(null)
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [passwordError, setPasswordError] = useState(null)
  const [repeatPasswordError, setRepeatPasswordError] = useState(null)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [showErrors, setErrorVisibility] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetToken, setResetToken] = useState(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const reset = async (e) => {
    e.preventDefault()
    const errors = {}
    if (loginType !== 'phone') {
      if (!isEmail(email)) {
        errors['email'] = 'Некорректный email'
      }
    }
    setErrors(errors)

    if (Object.keys(errors).length === 0) {
      setLoading(true)
      if (loginType === 'phone') {
        const res = await post({ 
          url: 'user/password/reset/phone', 
          data: { phone: phone.replace(/\D/g, '') } 
        })
        const data = await res.json()
        if (data.success) {
          const { password_reset_token, temp_password } = data.response
          setResetToken(password_reset_token)
        } else {
          const {  description } = data.error
          setError(description)
        }
        
      } else {
        const res = await post({ 
          url: 'user/password/reset/email', 
          data: { email } 
        })
        const data = await res.json()
        if (data.success) {
          const { password_reset_token, temp_password } = data.response
          setResetToken(password_reset_token)
        } else {
          const {  description } = data.error
          setError(description)
        }
      }
      setLoading(false)
    }
  }

  const checkCode = async () => {
    setCodeError(null)
    setLoading(true)
    const res = await post({ url: 'user/password/reset/check', data: { code, password_reset_token: resetToken } })
    const { success, error } = await res.json()
    if (success) {
      setShowPasswordForm(true)
    } else {
      if (error.error === 'user is not found') {
        setError(error.description)
      } else {
        setCodeError(error.description)
      }
      
    }
    setLoading(false)
  }

  const updatePassword = async () => {
    setPasswordError(null)
    setRepeatPasswordError(null)
    if (password.length < 5) {
      setPasswordError('Слишком короткий пароль')
      return
    }
    if (repeatPassword !== password) {
      setRepeatPasswordError('Пароли не совпадают')
      return
    }
    setLoading(true)
    const res = await post({ url: 'user/password/reset/change', data: { password_reset_token: resetToken, password } })
    const { success, error } = await res.json()
    if (success) {
      setShowSuccess(true)
    } else {
      setError(error.description)
    }
    setLoading(false)
  }

  return (
    <Form width={showSuccess ? '380px' : '460px'} Icon={showSuccess && SuccessIcon} title={error ? 'Ошибка' : (showSuccess ? 'Пароль сохранён' : 'Восстановление пароля')}>
      {showSuccess && (
        <div style={{ marginTop: 40 }}>
          <Button onClick={onClose} text="Ok" variant="outlined" fullWidth />
        </div>
      )}
      {!showSuccess && (!showPasswordForm ? (resetToken ? (
        <>
          <FormInfo>
            На ваш {loginType === 'phone' ? 'телефон' : 'email'} был отправлен одноразовый пароль, введите полученный пароль в поле ниже:
          </FormInfo>
          <FormRow>
            <FormRowTitle>
              Одноразовый пароль
            </FormRowTitle>
            <Input 
              value={code} 
              disabled={loading} 
              onChange={setCode} 
              fullWidth 
              type={InputType.Number} 
              color={codeError && InputColor.Error}
              hint={codeError}
              onHintClose={() => setCodeError(null)}
            />
            <FormRowText>
              <span className={s.resend} onClick={reset}>Отправить код повторно</span>
            </FormRowText>
          </FormRow>  
          <div>
            <Button onClick={checkCode} loading={loading} text="Отправить" disabled={!code} fullWidth />
          </div>
        </>
      ): (
      <>
        <FormInfo>
          {error || 'Введите email или номер телефона, указанные в профиле пользователя:'}
        </FormInfo>
        {!error && (
          <FormRow>
            <FormRowTitle>
              <LoginTypes selectedType={loginType} onSelect={setLoginType} />
            </FormRowTitle>
            {loginType === 'phone' ? (
              <Input 
                value={phone} 
                onChange={setPhone} 
                fullWidth 
                disabled={loading}
                type={InputType.Phone}
                color={showErrors && InputColor.Error}
                hint={showErrors && errors['phone']}
                onHintClose={() => setErrors({ ...errors, phone: null })}
              />
            ) : (
              <Input 
                value={email} 
                onChange={setEmail} 
                fullWidth 
                type={InputType.Email} 
                disabled={loading}
                color={showErrors && InputColor.Error}
                hint={showErrors && errors['email']}
                onHintClose={() => setErrors({ ...errors, email: null })}
              />
            )}
          </FormRow>
        )}
        <div>
          <Button 
            text={error ? "Ok" : "Отправить"}
            variant={error ? "outlined" : ""} 
            fullWidth 
            onClick={error ? () => setError(null) : reset} 
            loading={loading}
            disabled={!error && (loginType === 'phone' ? !phone : !email)} 
          />
        </div>
      </>)
    ) : (
      <>
        <FormInfo>
          Задайте новый пароль для входа:
        </FormInfo>
        <div className={s.text}>Пароль должен содержать<br />не менее 5 любых символов.</div>
        <FormRow>
          <FormRowTitle>
            Новый пароль
          </FormRowTitle>
          <Input 
            value={password} 
            disabled={loading} 
            onChange={setPassword} 
            fullWidth 
            type={InputType.Password} 
            color={passwordError && InputColor.Error}
            hint={passwordError}
            onHintClose={() => setPasswordError(null)}
          />
        </FormRow>

        <FormRow>
          <FormRowTitle>
            Повторите пароль
          </FormRowTitle>
          <Input 
            value={repeatPassword} 
            disabled={loading} 
            onChange={setRepeatPassword} 
            fullWidth 
            type={InputType.Password} 
            color={repeatPasswordError && InputColor.Error}
            hint={repeatPasswordError}
            onHintClose={() => setRepeatPasswordError(null)}
          />
        </FormRow>
        <div>
          <Button onClick={updatePassword} loading={loading} text="Изменить пароль" disabled={!password || !repeatPassword} fullWidth />
        </div>
      </>
    ))}
    </Form>
  )
}

export default withStyles(s)(ResetPassword)