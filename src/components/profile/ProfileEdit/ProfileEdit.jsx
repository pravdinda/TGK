import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import withStyles from 'isomorphic-style-loader/withStyles'
import useReactRouter from 'use-react-router'
import Form from 'components/form/Form/Form'
import Row from 'components/form/FormRow/FormRow'
import RowTitle from 'components/form/FormRowTitle/FormRowTitle'
import FormInfo from 'components/form/FormInfo/FormInfo'
import Input, { InputType, InputColor } from 'components/form/Input/Input'
import Buttons from 'components/form/FormButtons/FormButtons'
import Popup from 'components/common/Popup/Popup'
import Button from 'components/form/Button/Button'
import SuccessIcon from 'assets/success.svg'
import { post } from 'utils/api'
import { userInfoLoaded } from 'actions/auth'

import s from './ProfileEdit.css'


function ProfileEdit() {
  
  const { history } = useReactRouter()
  const info = useSelector(state => state.userInfo)
  const onCancel = () => history.push('/profile')
  const [changePhoneShowed, setChangePhoneShowed] = useState(false)
  const [changeEmailShowed, setChangeEmailShowed] = useState(false)
  const [name, setName] = useState(info.name)
  const [login, setLogin] = useState(info.login)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loginError, setLoginError] = useState(null)
  const [nameError, setNameError] = useState(null)
  const [phoneError, setPhoneError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [phone, setPhone] = useState()
  const [email, setEmail] = useState()
  const [code, setCode] = useState(null)
  const [codeError, setCodeError] = useState(null)
  const [operationEmailToken, setOperationEmailToken] = useState(null)
  const [operationPhoneToken, setOperationPhoneToken] = useState(null)
  const dispatch = useDispatch()

  const save = async e => {
    e.preventDefault()
    setLoading(true)
    setLoginError(null)
    setNameError(null)
    const res = await post({ url: 'user/login/new', data: { login, name } })
    const { success, response, error } = await res.json()
    if (success) {
      setShowSuccess(true)
      dispatch(userInfoLoaded(response.user))
      setLogin(response.user.login)
      setName(response.user.name)
    } else {
      if (error.error === 'login is not found') {
        setLoginError('Обязательное поле')
      } else if (error.error === 'name is not found') {
        setNameError('Обязательное поле')
      }
    }
    setLoading(false)
  }

  const sendPhone = async e => {
    e.preventDefault()
    setPhoneError(null)
    const res = await post({ url: 'user/phone/new', data: { phone: phone.replace(/\D/g, '') } })
    const { success, response, error } = await res.json()
    if (success) {
      setOperationPhoneToken(response.operation_token)
      setChangePhoneShowed(false)
      setPhone(null)
      setCode('')
      setCodeError(null)
    } else {
      if (error.description) {
        setPhoneError(error.description)
      }
    }
  }

  const sendEmail = async e => {
    e.preventDefault()
    setEmailError(null)
    const res = await post({ url: 'user/email/new', data: { email } })
    const { success, response, error } = await res.json()
    if (success) {
      setOperationEmailToken(response.operation_token)
      setChangeEmailShowed(false)
      setEmail('')
      setCode('')
      setCodeError(null)
    } else {
      if (error.description) {
        setEmailError(error.description)
      }
    }
  }

  const updatePhone = async e => { 
    e.preventDefault()
    setCodeError(null)
    const res = await post({ url: 'user/phone/change', data: { code: code.toString(), operation_token: operationPhoneToken } })
    const { success, response, error } = await res.json()
    setLoading(true)
    if (success) {
      dispatch(userInfoLoaded(response.user))
      setShowSuccess(true)
      setOperationPhoneToken(null)
      setCode('')
    } else {
      setCodeError(error.description)
    }
    setLoading(false)
  }

  const updateEmail = async e => { 
    e.preventDefault()
    setCodeError(null)
    const res = await post({ url: 'user/email/change', data: { code: code.toString(), operation_token: operationEmailToken } })
    const { success, response, error } = await res.json()
    setLoading(true)
    if (success) {
      dispatch(userInfoLoaded(response.user))
      setShowSuccess(true)
      setOperationEmailToken(null)
      setCode('')
    } else {
      setCodeError(error.description)
    }
    setLoading(false)
  }

  const resend = async e => {
    e.preventDefault()
    if (operationPhoneToken) {
      const res = await post({ url: 'user/phone/repeat', data: { operation_token: operationPhoneToken } })
      await res.json()
    } else {
      const res = await post({ url: 'user/email/repeat', data: { operation_token: operationEmailToken } })
      await res.json()
    }
  }

  useEffect(() => {
    setPhone(null)
    setPhoneError(null)
  }, [changePhoneShowed])
  useEffect(() => {
    setEmail(null)
    setEmailError(null)
  }, [changeEmailShowed])

  return (
    <Form className={s.container} width="540px">
      <Row>
        <RowTitle>Логин</RowTitle>
        <Input 
          value={login}
          onChange={setLogin}
          type={InputType.Login} 
          disabled={loading}
          color={loginError && InputColor.Error}
          hint={loginError}
          onHintClose={() => setLoginError(null)}
        />
      </Row>
      <Row>
        <RowTitle>Имя</RowTitle>
        <Input 
          type={InputType.Name}
          value={name}
          onChange={setName}
          disabled={loading}
          color={nameError && InputColor.Error}
          hint={nameError}
          onHintClose={() => setNameError(null)}
        />
      </Row>
      <Row>
        <RowTitle>Телефон</RowTitle>
        <Input 
          type={InputType.Phone}
          value={info.phone}
          onAction={() => setChangePhoneShowed(true)}
          action="Изменить"
          disabled
        />
      </Row>
      <Row>
        <RowTitle>Email</RowTitle>
        <Input 
          type={InputType.Email} 
          value={info.email}
          onAction={() => setChangeEmailShowed(true)}
          action="Изменить"
          disabled
        />
      </Row>
      <Buttons className={s.buttons}>
        <Button 
          onClick={onCancel} 
          className={s.cancelBtn} 
          variant="outlined" 
          text="Отмена" 
          disabled={loading}
        />
        <Button 
          className={s.saveBtn} 
          text="Сохранить изменения" 
          loading={loading}
          disabled={(name === info.name) && (login === info.login)}
          onClick={save}
        />
      </Buttons>
      {showSuccess && (
        <>
          <div className={s.overlay} />
          <div className={s.popup} style={{ width: '500px' }}>
            <div className={s.popupTitle}>
              <SuccessIcon />
              <span>Изменения успешно сохранены!</span>
            </div>
            <div className={s.popupInner}>
              <Button fullWidth variant="outlined" text="Ok" onClick={() => setShowSuccess(false)} />
            </div>
          </div>
        </>
      )}
      {operationEmailToken && (
        <Popup>
          <Form title="Код подтверждения">
            <FormInfo>
              На ваш email был отправлен одноразовый код. Введите полученный код в поле ниже:
            </FormInfo>
            <Row>
              <RowTitle>Код</RowTitle>
              <Input 
                type={InputType.Number}
                value={code}
                onChange={setCode}
                disabled={loading}
                color={codeError && InputColor.Error}
                hint={codeError}
                onHintClose={() => setCodeError(null)}
              />
            </Row>
            <div className={s.resend}>
              <span onClick={resend}>Отправить код повторно</span>
            </div>
            <Buttons>
              <Button disabled={loading} style={{ width: '140px' }} variant="outlined" text="Отмена" onClick={() => setOperationEmailToken(null)} />
              <Button disabled={!code} loading={loading} style={{ width: '210px', marginLeft: '10px' }} text="Отправить" onClick={updateEmail} />
            </Buttons>
          </Form>
        </Popup>
      )}
      {operationPhoneToken && (
        <Popup>
          <Form title="Код подтверждения">
            <FormInfo>
              На ваш номер телефона был отправлен одноразовый код. Введите полученный код в поле ниже:
            </FormInfo>
            <Row>
              <RowTitle>Код</RowTitle>
              <Input 
                type={InputType.Number}
                value={code}
                onChange={setCode}
                disabled={loading}
                color={codeError && InputColor.Error}
                hint={codeError}
                onHintClose={() => setCodeError(null)}
              />
            </Row>
            <div className={s.resend}>
              <span onClick={resend}>Отправить код повторно</span>
            </div>
            <Buttons>
              <Button disabled={loading} style={{ width: '140px' }} variant="outlined" text="Отмена" onClick={() => setOperationPhoneToken(null)} />
              <Button disabled={!code} loading={loading} style={{ width: '210px', marginLeft: '10px' }} text="Отправить" onClick={updatePhone} />
            </Buttons>
          </Form>
        </Popup>
      )}
      {changePhoneShowed && (
        <Popup>
          <Form title="Изменение телефона">
            <Row>
              <RowTitle>Введите новый номер телефона</RowTitle>
              <Input 
                type={InputType.Phone}
                value={phone}
                onChange={setPhone}
                color={phoneError && InputColor.Error}
                hint={phoneError}
              />
            </Row>
            <Buttons>
              <Button style={{ width: '140px' }} variant="outlined" text="Отмена" onClick={() => setChangePhoneShowed(false)} />
              <Button style={{ width: '210px', marginLeft: '10px' }} text="Обновить" onClick={sendPhone} />
            </Buttons>
          </Form>
        </Popup>
      )}
      {changeEmailShowed && (
        <Popup>
          <Form title="Изменение email">
            <Row>
              <RowTitle>Введите новый email</RowTitle>
              <Input 
                type={InputType.Email}
                value={email}
                onChange={setEmail}
                color={emailError && InputColor.Error}
                hint={emailError}
              />
            </Row>
            <Buttons>
              <Button style={{ width: '140px' }} variant="outlined" text="Отмена" onClick={() => setChangeEmailShowed(false)} />
              <Button style={{ width: '210px', marginLeft: '10px' }} text="Обновить" onClick={sendEmail} />
            </Buttons>
          </Form>
        </Popup>
      )}
    </Form>
  )
}

export default withStyles(s)(ProfileEdit)