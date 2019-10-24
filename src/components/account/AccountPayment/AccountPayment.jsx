import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import Form from 'components/form/Form/Form'
import Input, { InputType } from 'components/form/Input/Input'
import FormRow from 'components/form/FormRow/FormRow'
import FormInfo from 'components/form/FormInfo/FormInfo'
import FormGroup from 'components/form/FormGroup/FormGroup'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import FormRowText from 'components/form/FormRowText/FormRowText'
import Button from 'components/form/Button/Button'
import Select from 'components/form/Select/Select'
import SuccessIcon from 'assets/success.svg'
import FailIcon from 'assets/fail.svg'
import YandexImage from 'assets/yandex.png'
import PaymoImage from 'assets/paymo.png'
import ArrowIcon from 'assets/arrow_h.svg'
import { post } from 'utils/api'
import CloseIcon from 'assets/close.svg'

import s from './AccountPayment.css'

const years = []

for (let i = 2014; i <= new Date().getFullYear(); i++) {
  years.push({ id: i, value: i })
}

const months = [
  {
    id: 1,
    value: 'Январь'
  },
  {
    id: 2,
    value: 'Февраль'
  },
  {
    id: 3,
    value: 'Март'
  },
  {
    id: 4,
    value: 'Апрель'
  },
  {
    id: 5,
    value: 'Май'
  },
  {
    id: 6,
    value: 'Июнь'
  },
  {
    id: 7,
    value: 'Июль'
  },
  {
    id: 8,
    value: 'Август'
  },
  {
    id: 9,
    value: 'Сентябрь'
  },
  {
    id: 10,
    value: 'Октябрь'
  },
  {
    id: 11,
    value: 'Ноябрь'
  },
  {
    id: 12,
    value: 'Декабрь'
  }
]


function AccountPayment(props) {
  const { account } = props
  const [year, setYear] = useState(null)
  const [month, setMonth] = useState(null)

  const [fine, setFine] = useState(0)
  const [stateDuty, setStateDuty] = useState(0)
  const [sum, setSum] = useState(0)
  const [payMethodsShowed, setPayMethodsShowed] = useState(false)
  const [successShowed, setSuccessShowed] = useState(false)
  const [error, setError] = useState(null)

  const total = sum + fine + stateDuty

  useEffect(
    () => {
      setYear(null)
      setMonth(null)
      setError(null)
    },
    [account]
  )

  useEffect(
    () => {
      setSum(props.sum)
      setFine(props.fine)
      setStateDuty(props.stateDuty)
    },
    [props.sum, props.fine, props.stateDuty]
  )

  const onButtonClick = () => {
    setPayMethodsShowed(true)
  }

  const sendPay = async (payment_gateway) => {
    const data = {
      number: account,
      year: year.id,
      month: month.id,
      sum,
      fine,
      state_duty: stateDuty,
      payment_gateway
    }
    const res = await post({ url: 'guest/account/payment/pay/new', data })
    const { success, response, error } = await res.json()
    if (success) {
      const tgc2_id = response.tgc2_id
      const data = payment_gateway === 1 ? response.yandex : response.paymo


      if (payment_gateway === 1) {
        const { merchant_id } = data
        const $checkout = YandexCheckoutUI(+merchant_id, {
          language: 'ru',
          amount: total,
        })



        $checkout.on('yc_success', async yandexRes => {
          const { paymentToken } = yandexRes.data.response
          const data = {
            payment_token: paymentToken,
            tgc2_id,
          }
          const res = await post({ url: 'guest/account/payment/pay/token', data })
          const { success, response, error } = await res.json()
          if (success) {
            $checkout.chargeSuccessful();
            if (response['3ds_link']) {
              localStorage.setItem('account_number', account)
              window.location.href = response['3ds_link']
            } else {
              $checkout.close()
              setYear(null)
              setMonth(null)
              setFine(0)
              setStateDuty(0)
              setSum(0)
              setError(null)
              setSuccessShowed(true)
            }
          } else {
            $checkout.close()
            setError(error.description)
          }
        })

        $checkout.on('yc_error', yandexRes => {
          // const err = yandexRes.error
          // console.log(err)
          $checkout.chargeFailful()
          // if (err.type === 'validation_error') {
          //   $checkout.chargeFailful(err.params[0].message)
          // }

        })
        $checkout.open()
        setPayMethodsShowed(false)
      } else {
        const { api_key, extra_bac, signature, success_redirect, fail_redirect } = data
        const form = document.createElement("form");
        form.setAttribute('method', 'POST');
        form.setAttribute('action', 'https://checkout.paymo.ru/uniform/')

        const fields  = {
          amount: total * 100, api_key, extra_bac, signature, success_redirect, fail_redirect, description: 'gfdgdf',
          tx_id: tgc2_id, //email: 'tanat87@gmail.com', phone: '79817868981'
        }

        Object.keys(fields).map(key => {
          const f = document.createElement("input");
          f.setAttribute("type", "hidden");
          f.setAttribute("name", key);
          f.setAttribute("value", fields[key]);
          form.appendChild(f);
        })
        form
        document.body.appendChild(form);

        localStorage.setItem('account_number', account)
        setTimeout(() => {
          form.submit()
        }, 100)
      }

    }
  }

  return (
    <Form width="100%" className={s.form}>
      <FormInfo>
        <span className={s.green}>Внимание!</span> Форма оплаты может не поддерживать устаревшие браузеры.
        Рекомендуем использовать актуальные версии Google Chrome, Mozilla Firefox
        или Internet Explorer.
      </FormInfo>
      <div className={s.title}>Введите сумму платежа и период оплаты:</div>
      <FormGroup className={s.group}>
        <FormRow>
          <FormRowTitle>Сумма</FormRowTitle>
          <Input suffix=" ₽" value={sum || 0} onChange={setSum} type={InputType.Currency} fullWidth />
        </FormRow>
        <FormRow>
          <FormRowTitle>Пени</FormRowTitle>
          <Input suffix=" ₽" value={fine || 0} onChange={setFine} type={InputType.Currency} fullWidth />
        </FormRow>
        <FormRow>
          <FormRowTitle>Госпошлина</FormRowTitle>
          <Input suffix=" ₽" value={stateDuty || 0} onChange={setStateDuty} type={InputType.Currency} fullWidth />
        </FormRow>
        <FormRow>
          <FormRowTitle>Итоговая сумма</FormRowTitle>
          <Input disabled suffix=" ₽" value={total.toFixed(2) || 0} type={InputType.Currency} fullWidth />
        </FormRow>

      </FormGroup>
      <FormGroup className={cx(s.group, s.bottom)}>
        <FormRow className={s.select}>
          <FormRowTitle>Месяц</FormRowTitle>
          <Select value={month} onChange={setMonth} options={months} fullWidth />
        </FormRow>
        <FormRow className={s.select}>
          <FormRowTitle>Год</FormRowTitle>
          <Select value={year} options={years} onChange={setYear} fullWidth />
        </FormRow>
        <Button
          className={s.button}
          text="Оплатить"
          disabled={!total || !month || !year}
          onClick={onButtonClick}
        />
      </FormGroup>
      <FormRow>
        <FormRowText>
          Нажимая "Оплатить" Вы соглашаетесь с <a href="https://api-lk.tgc-2.ru/files/%D0%A3%D1%81%D0%BB%D0%BE%D0%B2%D0%B8%D1%8F%20%D0%BE%D0%BF%D0%BB%D0%B0%D1%82%D1%8B.pdf" target="_blank" className={s.condition}>условиями оплаты</a>.
        </FormRowText>
      </FormRow>

      {payMethodsShowed && (
        <>
          <div className={s.overlay1} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <span>Выберите способы оплаты:</span>
            </div>
            <div className={s.popupInner}>
              <div className={s.yandex} onClick={() => sendPay(1)}>
                <img src={YandexImage} />
                <ArrowIcon className={s.arrow} />
              </div>
              <div className={s.paymo} onClick={() => sendPay(2)}>
                <img src={PaymoImage} />
                <ArrowIcon className={s.arrow} />
              </div>
            </div>
            <CloseIcon className={s.close1} onClick={() => setPayMethodsShowed(false)} />
          </div>
        </>
      )}
      {successShowed && (
        <>
          <div className={s.overlay1} />
          <div className={s.popup} style={{ width: '380px' }}>
            <div className={s.popupTitle}>
              <SuccessIcon />
              <span>Платёж выполнен!</span>
            </div>
            <div className={s.popupInner}>
              <Button fullWidth variant="outlined" text="Ok" onClick={() => setSuccessShowed(false)} />
            </div>
          </div>
        </>
      )}
      {error && (
        <>
          <div className={s.overlay1} />
          <div className={s.popup} style={{ width: '380px' }}>
            <div className={s.popupTitle}>
              <FailIcon />
              <span>Ошибка</span>
            </div>
            <div className={s.popupText}>{error}</div>
            <div className={s.popupInner}>
              <Button fullWidth variant="outlined" text="Ok" onClick={() => setError(false)} />
            </div>
          </div>
        </>
      )}
    </Form>
  )
}

export default withStyles(s)(AccountPayment)