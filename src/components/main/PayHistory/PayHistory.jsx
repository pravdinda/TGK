import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import moment from 'moment'
import withStyles from 'isomorphic-style-loader/withStyles'
import CloseIcon from 'assets/close.svg'
import Form from 'components/form/Form/Form'
import FormRow from 'components/form/FormRow/FormRow'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import Button from 'components/form/Button/Button'
import Select from 'components/form/Select/Select'
import { post } from 'utils/api'

import s from './PayHistory.css'
import { formatCurrency } from 'utils/number'


type Props = {
  onClose: Function,
  hidden: boolean,
}

const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const months = monthNames.map((value, id) => ({ id, value }))

const years = []

for (let i = new Date().getFullYear() - 5; i <= new Date().getFullYear(); i++) {
  years.push({ id: i, value: i })
}



function PayHistory(props: Props) {
  const { onClose, hidden, account } = props
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [filtered, setFiltered] = useState([])
  const today = new Date()
  const initialYear = years.find(y => y.id === today.getFullYear())
  const initialFromYear = years.find(y => y.id === today.getFullYear() - 1)
  const initialMonth = months.find(m => m.id === today.getMonth())
  const [from, setFrom] = useState({ year: initialFromYear, month: initialMonth })
  const [to, setTo] = useState({ year: initialYear, month: initialMonth })


  useEffect(
    () => {
      async function onLoad() {
        setLoading(true)
        const data = {
          type: account.type === 1 ? 1 : 2,
          account_id: account.id,

        }
        const res = await post({ url: 'account/payment/pay/all', data })
        const { success, response, error } = await res.json()
        if (success) {
          setItems(response.payments)
          const fromDate = new Date(from.year.id, from.month.id)
          const toDate = new Date(to.year.id, to.month.id + 1)
          const filtered = response.payments.filter(i => {
            const createDate = new Date(i.create)
            return createDate >= fromDate && createDate <= toDate
          })
          setFiltered(filtered)
        }
        setLoading(false)
      }
      if (!hidden) {
        document.body.style.overflow = 'hidden'
        onLoad()
      } else {
        document.body.style.overflow = 'visible'
      }
    },
    [hidden]
  )

  useEffect(
    () => {

    },
    []
  )

  const onClick = () => {
    const fromDate = new Date(from.year.id, from.month.id)
    const toDate = new Date(to.year.id, to.month.id + 1)
    const filtered = items.filter(i => {
      const createDate = new Date(i.create)
      return createDate >= fromDate && createDate <= toDate
    })
    setFiltered(filtered)
  }

  useEffect(
    () => {
      if (from.year.id === to.year.id && from.month.id > to.month.id) {
        setTo({ ...to, month: from.month })
      }
    },
    [to.year.id]
  )

  useEffect(
    () => {
      if (from.year.id === to.year.id && from.month.id > to.month.id) {
        setFrom({ ...from, month: to.month })
      }
    },
    [from.year.id]
  )

  let fromYears = years.filter(y => y.id <= to.year.id)
  let fromMonths = months
  const toYears = years.filter(y => y.id >= from.year.id)
  let toMonths = months

  if (to.year.id === from.year.id) {
    fromMonths = fromMonths.filter(m => m.id <= to.month.id)
    toMonths = toMonths.filter(m => m.id >= from.month.id)
  }


  return (
    <div className={cx(s.container, { [s.hidden]: hidden } )}>
      <div className={s.overlay} />
      <div className={s.window}>
        <CloseIcon className={s.close} onClick={onClose} />
        <div className={s.title}>История платежей</div>
        <div className={s.text}>
          Выберите период просмотра. По умолчанию выбирается<br />
          период за последние 12 месяцев
        </div>
        <Form width="100%" className={s.form}>
          <FormRow>
            <FormRowTitle>Выберите период</FormRowTitle>
            <div className={s.selects}>
              <Select
                className={s.year}
                options={fromYears}
                value={from.year}
                onChange={year => setFrom({...from, year })}
              />
              <Select
                className={s.month}
                options={fromMonths}
                value={from.month}
                onChange={month => setFrom({...from, month })}
              />
              <div className={s.line} />
              <Select
                className={s.year}
                options={toYears}
                value={to.year}
                onChange={year => setTo({...to, year })}
              />
              <Select
                className={s.month}
                options={toMonths}
                value={to.month}
                onChange={month => setTo({...to, month })}
              />
            </div>
          </FormRow>
          <Button onClick={onClick} fullWidth className={s.button} text="Выбрать" />
        </Form>
        <div className={s.result}>
          <div className={s.head}>
            <div className={cx(s.date, { [s.org]: account.type === 3 })}>Дата</div>
            <div className={s.sum}>Сумма</div>
            {account.type !== 3 && <div className={s.source}>Источник</div>}

          </div>
          <div className={s.list}>
            {!loading ? (filtered.length == 0 ? (<div className={s.empty}>Нет платежей за выбранный период</div>) :
              (
                <>
                  {filtered.map(i => (
                    <div className={s.row} key={i.id}>
                      <div className={cx(s.date, { [s.org]: account.type === 3 })}>{moment(i.create).format('DD.MM.YYYY')}</div>
                      <div className={s.sum}>{formatCurrency(i.sum)}</div>
                      {account.type !== 3 && (
                        <>
                          <div className={s.source}>{i.payment_gateway}</div>
                          <div className={s.check}>
                            {i.ticket_url && <a href={i.ticket_url} target="_blank">Получить чек</a>}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </>
              )
            ) :null}

          </div>
        </div>
      </div>
    </div>
  )
}

export default withStyles(s)(PayHistory)