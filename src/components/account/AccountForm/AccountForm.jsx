// @flow
import React, { useState } from 'react'
import useReactRouter from 'use-react-router';
import withStyles from 'isomorphic-style-loader/withStyles'
import Form from 'components/form/Form/Form'
import Input, { InputType, InputColor } from 'components/form/Input/Input'
import FormRow from 'components/form/FormRow/FormRow'
import FormInfo from 'components/form/FormInfo/FormInfo'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import FormButtons from 'components/form/FormButtons/FormButtons'
import Button from 'components/form/Button/Button'
import Captcha from 'components/common/Captcha/Captcha'
import { post } from 'utils/api'

import s from './AccountForm.css'

function AccountForm() {
  const [account, setAccount] = useState('')
  const { history, match } = useReactRouter();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [captcha, setCaptcha] = useState()

  const onSubmit = async e => {
    setLoading(true)
    setError(null)
    e.preventDefault()
    const res = await post({ url: 'guest/account/address', data: { number: account.toString() } })
    const { success, error, response } = await res.json()
    if (success) {
      if (response.is_archive) {
        setError('Указанный номер лицевого счета не существует.')
      } else {
        history.push(`${match.path}/${btoa(account.toString() + 'KpuAqpyElg')}`)
      }
    } else {

      setError(error.description)

    }
    setLoading(false)
  }
  return (
    <div className={s.container}>
      <Form title="Сервис без регистрации" className={s.form}>
        <FormInfo>
          Для ввода показаний приборов учёта или оплаты
          без регистрации введите ниже ваш лицевой счет
        </FormInfo>
        <FormRow>
          <FormRowTitle>Лицевой счет</FormRowTitle>
          <Input
            fullWidth
            name="account"
            value={account}
            onChange={setAccount}
            type={InputType.Number}
            disabled={loading}
            color={error && InputColor.Error}
            hint={error}
            onHintClose={() => setError(null)}
          />
        </FormRow>
        <FormRow>
          <Captcha onChange={setCaptcha} hidden={loading} />
        </FormRow>
        <FormButtons>
          <Button loading={loading} disabled={!captcha || !account} onClick={onSubmit} text="Перейти" fullWidth />
        </FormButtons>
      </Form>
    </div>
  )
}

export default withStyles(s)(AccountForm)