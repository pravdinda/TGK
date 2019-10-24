// @flow
import React, { useState, useEffect } from 'react'
import useReactRouter from 'use-react-router';
import withStyles from 'isomorphic-style-loader/withStyles'
import Form from 'components/form/Form/Form'
import Input, { InputType, InputColor } from 'components/form/Input/Input'
import FormRow from 'components/form/FormRow/FormRow'
import FormInfo from 'components/form/FormInfo/FormInfo'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import FormButtons from 'components/form/FormButtons/FormButtons'
import Button from 'components/form/Button/Button'
import Tabs from 'components/common/Tabs/Tabs'
import AccountPayment from 'components/account/AccountPayment/AccountPayment'
import AccountDeviceReading from 'components/account/AccountDeviceReading/AccountDeviceReading'
import Captcha from 'components/common/Captcha/Captcha'
import { post } from 'utils/api'
import SpinnerIcon from 'assets/spinner.svg'

import s from './AccountDetail.css'

function AccountDetail() {
  const { match, history, location } = useReactRouter()
  const [tabIndex, setTabIndex] = useState(0)
  const [account, setAccount] = useState(+(atob(match.params.account).replace('KpuAqpyElg', '')))
  const [accountError, setAccountError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accountLoading, setAccountLoading] = useState(false)
  const [captcha, setCaptcha] = useState(null)
  const [address, setAddress] = useState(null)
  const [toPay, setToPay] = useState(0)
  const [fine, setFine] = useState(0)
  const [stateDuty, setStateDuty] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const res = await post({ url: 'guest/account/address', data: { number: atob(match.params.account).replace('KpuAqpyElg', '') } })
      const { success, response } = await res.json()
      if (success && !response.is_archive) {
        setAddress(response.address)
        setToPay(response.to_pay)
        setFine(response.fine)
        setStateDuty(response.state_duty)
      } else {
        history.replace('/guest-service')
      }
      setLoading(false)
    }
    load()
  }, [])


  const onSubmit = async e => {
    e.preventDefault()
    setAccountError(null)
    setAccountLoading(true)
    const res = await post({ url: 'guest/account/address', data: { number: account } })
    const { success, response, error } = await res.json()
    if (success) {
      if (response.is_archive) {
        setAccountError('Указанный номер лицевого счета не существует.')
      } else {
        setAddress(response.address)
        setToPay(response.to_pay)
        setFine(response.fine)
        setStateDuty(response.state_duty)
        setTabIndex(0)
        history.push(`/guest-service/${btoa(account.toString() + 'KpuAqpyElg')}`)
      }
    } else {
      setAccountError(error.description)
    }
    setAccountLoading(false)

  }

  return (
    <div className={s.container}>
      {loading ? <SpinnerIcon className={s.spinner} /> : (
        <>
          <div className={s.form}>
            <Form title="Информация">
              <FormInfo>
                Вы можете произвести оплату и ввести
                показания приборов учета без регистрации
                по данному лицевому счету, либо по вновь
                введенному.
              </FormInfo>
              <FormRow className={s.address}>
                <div className={s.addressLabel}>Адрес:</div>
                <div>{address}</div>
              </FormRow>
              <FormRow>
                <FormRowTitle>Лицевой счёт:</FormRowTitle>
                <Input
                  fullWidth
                  type={InputType.Number}
                  value={account}
                  onChange={setAccount}
                  color={accountError && InputColor.Error}
                  disabled={accountLoading}
                  hint={accountError}
                  onHintClose={() => setAccountError(null)}
                />
              </FormRow>
              <FormRow>
                <Captcha onChange={setCaptcha} hidden={accountLoading} />
              </FormRow>
              <FormButtons>
                <Button
                  onClick={onSubmit}
                  fullWidth
                  text="Изменить"
                  disabled={!captcha || (+account === +(atob(match.params.account).replace('KpuAqpyElg', '')))}
                  loading={accountLoading}
                />
              </FormButtons>
            </Form>
          </div>
          <div className={s.content}>
            <Tabs
              tabs={[
                {
                  label: 'Оплата',
                },
                {
                  label: 'Показания приборов учета',
                },
              ]}
              onSelect={setTabIndex}
              currentIndex={tabIndex}
            />
            <div className={s.tabContent}>
              {tabIndex === 0 ? (
                <AccountPayment sum={toPay} fine={fine} stateDuty={stateDuty} account={+(atob(match.params.account).replace('KpuAqpyElg', ''))} />
              ) : (
                <AccountDeviceReading account={+(atob(match.params.account).replace('KpuAqpyElg', ''))} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default withStyles(s)(AccountDetail)