// @flow
import React, { useState } from 'react'
import withStyles from 'isomorphic-style-loader/withStyles'
import Form from 'components/form/Form/Form'
import Input, { InputType, InputColor } from 'components/form/Input/Input'
import FormRow from 'components/form/FormRow/FormRow'
import FormInfo from 'components/form/FormInfo/FormInfo'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import Button from 'components/form/Button/Button'
import { post } from 'utils/api'

import s from './ConfirmPhoneForm.css'


type Props = {
  onConfirm?: Function,
  token: string,
}

function ConfirmPhoneForm(props: Props) {
  const { onConfirm, token } = props
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const confirm = async e => {
    setMessage(null)
    e.preventDefault()
    setLoading(true)
    const res = await post({ 
      url: 'user/phone/code/check',
      data: { code, signup_token: token }
    })

    setLoading(false)
    const data = await res.json()

    if (data.success) {
      onConfirm(data.response.user)
    } else {
      setMessage(data.error.description)
      setMessageType(InputColor.Error)
    }
  }

  const onResend = async () => {
    const res = await post({ 
      url: 'user/phone/code/new',
      data: { signup_token: token }
    })
    const { success, error } = await res.json()
    if (success) {
      setMessage('Код отправлен повторно')
      setMessageType(InputColor.Default)
    } else {
      setMessage(error.description)
      setMessageType(InputColor.Error)
    }
  }
  
  return (
    <div className={s.container}>
      <Form title="Код подтверждения">
        <FormInfo>
          На ваш номер телефона был отправлен одноразовый код. Введите полученный код в поле ниже:
        </FormInfo>
        <FormRow>
          <FormRowTitle>
            Код
          </FormRowTitle>
          <Input 
            fullWidth 
            value={code} 
            onChange={setCode} 
            type={InputType.Number}
            color={messageType}
            hint={message}
            disaled={loading}
            onHintClose={() => setMessage(null)}
          />
        </FormRow>
        <div className={s.resend}>
          <span onClick={onResend}>Отправить код повторно</span>
        </div>
        <div>
          <Button text="Отправить" disabled={!code.trim().length === 0} onClick={confirm} fullWidth loading={loading} />
        </div>
      </Form>
    </div>
  )
}

export default withStyles(s)(ConfirmPhoneForm)