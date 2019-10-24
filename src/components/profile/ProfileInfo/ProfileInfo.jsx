import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import withStyles from 'isomorphic-style-loader/withStyles'
import Form from 'components/form/Form/Form'
import FormInfo from 'components/form/FormInfo/FormInfo'
import Row from 'components/form/FormRow/FormRow'
import RowTitle from 'components/form/FormRowTitle/FormRowTitle'
import RowValue from 'components/form/FormRowValue/FormRowValue'
import Buttons from 'components/form/FormButtons/FormButtons'
import Button from 'components/form/Button/Button'
import Popup from 'components/common/Popup/Popup'
import Input, { InputType, InputColor } from 'components/form/Input/Input'
import PencilIcon from 'assets/pencil.svg'
import SuccessIcon from 'assets/success.svg'
import { post } from 'utils/api'


import s from './ProfileInfo.css'

function ProfileInfo() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oldPassword, setOldPassword] = useState(null)
  const [oldPasswordError, setOldPasswordError] = useState(null)
  const [password, setPassword] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [repeatPassword, setRepeatPassword] = useState(null)
  const [repeatPasswordError, setRepeatPasswordError] = useState(null)
  const [changePasswordShowed, setChangePasswordShowed] = useState(false)
  const info = useSelector(state => state.userInfo)
  const formatted = info.phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5")

  const updatePassword = async () => {
    setPasswordError(null)
    setRepeatPasswordError(null)
    setOldPasswordError(null)
    if (password.length < 5) {
      setPasswordError('Слишком короткий пароль')
      return
    }
    if (repeatPassword !== password) {
      setRepeatPasswordError('Пароли не совпадают')
      return
    }
    setLoading(true)
    const res = await post({ url: 'user/password/change', data: { old_password: oldPassword, new_password: password } })
    const { success, error } = await res.json()
    if (success) {
      setChangePasswordShowed(false)
      setShowSuccess(true)
    } else {
      if (error.error === 'old password error') {
        setOldPasswordError(error.description)
      }
      
    }
    setLoading(false)
  }
  return (
    <div className={s.container}>
      <Form width="420px">
        <Row>
          <RowTitle>Логин</RowTitle>
          <RowValue>{info.login}</RowValue>
        </Row>
        <Row>
          <RowTitle>Имя</RowTitle>
          <RowValue>{info.name}</RowValue>
        </Row>
        <Row>
          <RowTitle>Телефон</RowTitle>
          <RowValue>{formatted}</RowValue>
        </Row>
        <Row>
          <RowTitle>Email</RowTitle>
          <RowValue className={s.email}>{info.email}</RowValue>
        </Row>
        <Buttons className={s.buttons}>
          <Button onClick={() => setChangePasswordShowed(true)} fullWidth variant="outlined" text="Сменить пароль" />
        </Buttons>
      </Form>
      <div className={s.bottom}>
        <Link to="/profile/edit" className={s.editLink}>
          <PencilIcon />
          <span>Редактировать профиль</span>
        </Link>
      </div>
      {changePasswordShowed && (
        <Popup>
          <Form width="540px">
            <Row>
              <RowTitle>
                Старый пароль
              </RowTitle>
              <Input 
                value={oldPassword} 
                disabled={loading} 
                onChange={setOldPassword} 
                fullWidth 
                type={InputType.Password} 
                color={oldPasswordError && InputColor.Error}
                hint={oldPasswordError}
                onHintClose={() => setOldPasswordError(null)}
              />
            </Row>
            <Row>
              <RowTitle>
                Новый пароль
              </RowTitle>
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
            </Row>

            <Row>
              <RowTitle>
                Повторите новый пароль
              </RowTitle>
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
            </Row>
            <Buttons>
              <Button style={{ width: '140px' }} variant="outlined" text="Отмена" onClick={() => setChangePasswordShowed(false)} />
              <Button loading={loading} style={{ width: '290px', marginLeft: '10px' }} text="Сохранить изменения" onClick={updatePassword} />
            </Buttons>
          </Form>
        </Popup>
      )}
      {showSuccess && (
        <>
          <div className={s.overlay} />
          <div className={s.popup} style={{ width: '500px' }}>
            <div className={s.popupTitle}>
              <SuccessIcon />
              <span>Пароль успешно изменен!</span>
            </div>
            <div className={s.popupInner}>
              <Button fullWidth variant="outlined" text="Ok" onClick={() => setShowSuccess(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default withStyles(s)(ProfileInfo)