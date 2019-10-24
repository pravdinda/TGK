import React, { useState } from 'react'
import withStyles from 'isomorphic-style-loader/withStyles'
import { useDispatch } from 'react-redux'
import Form from 'components/form/Form/Form'
import Input, { InputType, InputColor } from 'components/form/Input/Input'
import FormRow from 'components/form/FormRow/FormRow'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import Button from 'components/form/Button/Button'
import Checkbox from 'components/form/Checkbox/Checkbox'
import FormButtons from 'components/form/FormButtons/FormButtons'
import FormError from 'components/form/FormError/FormError'
import Notifications from 'components/notifications/Notifications/Notifications'
import SuccessMessage from 'components/auth/SuccessMessage/SuccessMessage'
import ConfirmPhoneForm from 'components/auth/ConfirmPhoneForm/ConfirmPhoneForm'
import Captcha from 'components/common/Captcha/Captcha'
import Popup from 'components/common/Popup/Popup'
import useForm from 'hooks/useForm'
import { isEmail, isLogin, isName, isPassword } from 'utils/string'
import { loadUserInfo } from 'services/auth'
import { post, setToken, setRefreshToken } from 'utils/api'


import s from './Register.css'


const fieldsData = [
  {
    name: 'login',
    type: InputType.Login,
    required: true,
  },
  {
    name: 'name',
    type: InputType.Name,
    required: true,
  },
  {
    name: 'password',
    type: InputType.Password,
    required: true,
  },
  {
    name: 'repeat-password',
    type: InputType.Password,
    required: true,
  },
  {
    name: 'email',
    type: InputType.Email,
    required: true,
  },
  {
    name: 'm_phone',
    type: InputType.Phone,
    required: true,
  },
  {
    name: 'agree',
    type: "checkbox",
    initialValue: false,
    required: true,
  }
  
]

function Register() {
  const fields = useForm(fieldsData)
  const [showErrors, setErrorVisibility] = useState(false)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [isSuccess, setSuccess] = useState(false)
  const [sToken, setSToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [captcha, setCaptcha] = useState(null)

  const dispatch = useDispatch()

  const register = async (e) => {
    e.preventDefault()
    setErrorVisibility(true)
    const errors = {}
    Object.keys(fields).forEach(key => {
      const field = fields[key]
      let error
      if (field.required) {
        if (!field.value) {
          error = 'Обязательное поле'
        } else {
          const value = field.value
          if (field.type === 'email') {
            if (!isEmail(value)) {
              error = 'Некорректный email'
            }
          } else if (field.type === 'login') {
            if (!isLogin(value)) {
              error = 'Некорректный логин'
            }
          } else if (field.type === 'name') {
            if (!isName(value)) {
              error = 'Некорректное имя'
            }
          } else if (field.type === 'password') {
            if (!isPassword(value)) {
              error = 'Некорректный пароль'
            } else if (field.name === 'password' && value.length < 5) {
              error = 'Слишком короткий пароль'
            }
          }
        }
      }
      if (error) {
        errors[key] = error
      }
    })
    if (fields['password'].value !== fields['repeat-password'].value) {
      errors['repeat-password'] = 'Пароли не совпадают'
    }
    setErrors(errors)
    
    if (Object.keys(errors).length === 0) {

      const email = fields['email'].value
      const phone = fields['m_phone'].value.replace(/\D/g, '')
      const name = fields['name'].value
      const login = fields['login'].value

      try {
        setLoading(true)
        const res = await post({
          url: 'user/new',
          data: { email, phone, name, login }
        })
        
        const data = await res.json()
        
        if (data.success) {
          setSToken(data.response.signup_token)
        } else {
          const { error, description } = data.error
          const errors = {}
          setErrorVisibility(true)
          if (error === 'login is already taken') {
            errors['login'] = description
          } else if (error === 'email is already taken') {
            errors['email'] = description
          } else if (error === 'phone is already taken') {
            errors['m_phone'] = description
          }
          
          setErrors(errors)
        }
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
  }

  const onConfirm = async () => {
    const res = await post({ 
      url: 'user/password/new',
      data: { signup_token: sToken, password: fields['password'].value }
    })
    const { response, success, error } = await res.json()

    if (success) {
      const { access_token, refresh_token } = response
      setToken(access_token)
      setRefreshToken(refresh_token)
      setSuccess(true)
    } else {
      setErrors({ password: error.description })
    }
  }

  if (isSuccess) {
    return (
      <div className={s.container} onClick={async () => {
        window.scrollTo(0, 0)
        dispatch(loadUserInfo())
      }}>
        <SuccessMessage />
      </div>
    )
  }

  
  return  (
    <div className={s.container}>
      <Notifications className={s.notifications} />
      <Form title="Регистрация" className={s.form}>
        <FormRow>
          <FormRowTitle>
            Логин*
          </FormRowTitle>
          <Input 
            name="login" 
            type={InputType.Login} 
            value={fields['login'].value}
            onChange={fields['login'].handler}
            fullWidth 
            color={showErrors && errors['login'] ? InputColor.Error : InputColor.Default}
            hint={showErrors && errors['login']}
            onHintClose={() => setErrors({ ...errors, login: null })}
            disabled={loading}
          />
        </FormRow>
        <FormRow>
          <FormRowTitle>Пароль*</FormRowTitle>
          <Input 
            fullWidth 
            name="password" 
            value={fields['password'].value} 
            onChange={fields['password'].handler}
            type={InputType.Password} 
            color={showErrors && errors['password'] ? InputColor.Error : InputColor.Default}
            hint={showErrors && errors['password']}
            onHintClose={() => setErrors({ ...errors, password: null })}
            disabled={loading}
          />
        </FormRow>
        <FormRow>
          <FormRowTitle>Повторите пароль*</FormRowTitle>
          <Input 
            fullWidth 
            type={InputType.Password} 
            name="repeat-password" 
            value={fields['repeat-password'].value} 
            onChange={fields['repeat-password'].handler}
            color={showErrors && errors['repeat-password'] ? InputColor.Error : InputColor.Default}
            hint={showErrors && errors['repeat-password']}
            onHintClose={() => setErrors({ ...errors, ['repeat-password']: null })}
            disabled={loading}
          />
        </FormRow>
        <FormRow>
          <FormRowTitle>
            Имя*
          </FormRowTitle>
          <Input 
            fullWidth 
            type={InputType.Name} 
            name="name" 
            value={fields['name'].value} 
            onChange={fields['name'].handler}
            color={showErrors && errors['name'] ? InputColor.Error : InputColor.Default}
            hint={showErrors && errors['name']}
            onHintClose={() => setErrors({ ...errors, name: null })}
            disabled={loading}
          />
        </FormRow>
        <FormRow>
          <FormRowTitle>
            Телефон*
          </FormRowTitle>
          <Input 
            fullWidth 
            type={InputType.Phone} 
            name="m_phone" 
            value={fields['m_phone'].value} 
            onChange={fields['m_phone'].handler}
            color={showErrors && errors['m_phone'] ? InputColor.Error : InputColor.Default}
            hint={showErrors && errors['m_phone']}
            onHintClose={() => setErrors({ ...errors, m_phone: null })}
            disabled={loading}
          />
        </FormRow>
        <FormRow>
          <FormRowTitle>
            Email*
          </FormRowTitle>
          <Input 
            fullWidth 
            type={InputType.Email} 
            name="email" 
            value={fields['email'].value} 
            onChange={fields['email'].handler}
            color={showErrors && errors['email'] ? InputColor.Error : InputColor.Default}
            hint={showErrors && errors['email']}
            onHintClose={() => setErrors({ ...errors, email: null })}
            disabled={loading}
          />
        </FormRow>
        <FormRow>
          <Checkbox 
            checked={fields['agree'].value} 
            onChange={fields['agree'].handler} 
            disabled={loading}
            name="agree"
          >
            Согласен с <a href="https://api-lk.tgc-2.ru/files/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B8%D1%81%D0%BE%D0%BC.pdf" target="_blank">правилами пользования сервисом</a> "Личный кабинет"
          </Checkbox>
        </FormRow>
        <FormRow>
          <Captcha onChange={setCaptcha} />
        </FormRow>
        <FormButtons>
          <Button disabled={!fields['agree'].value || !captcha} onClick={register} text="Зарегистрироваться" fullWidth loading={loading} />
        </FormButtons>
        {error && <FormError>{error}</FormError>}
      </Form>
      {sToken && (
        <Popup onClose={() => setSToken(null)}>
          <ConfirmPhoneForm onConfirm={onConfirm} token={sToken} />
        </Popup>
      )}
    </div>
  )
}

export default withStyles(s)(Register)