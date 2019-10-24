import React, { useState, useEffect  } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import Form from 'components/form/Form/Form'
import FormRow from 'components/form/FormRow/FormRow'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import Select from 'components/form/Select/Select'
import Button from 'components/form/Button/Button'
import { post } from 'utils/api'
import SpinnerIcon from 'assets/spinner.svg'
import { formatCurrency } from 'utils/number'
import { setDocsVisibilityAction } from 'actions/account'

import s from './Accruals.css'

const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const months = monthNames.map((value, id) => ({ id, value }))

const years = []

for (let i = new Date().getFullYear() - 5; i <= new Date().getFullYear(); i++) {
  years.push({ id: i, value: i })
}


function Accruals() {
  const account = useSelector(state => state.account)
  const [accruals, setAccruals] = useState(null)
  const [from, setFrom] = useState({ year: years[5], month: months[0] })
  const [to, setTo] = useState({ year: years[5], month: months[11] })
  const dispatch = useDispatch()
  useEffect(
    () => {
      async function onLoad() {
        setAccruals(null)
        const fromDate = new Date(from.year.id, from.month.id)
        fromDate.setDate(fromDate.getDate() + 1)
        fromDate.setUTCHours(0)
        fromDate.setUTCMinutes(0)
        fromDate.setUTCSeconds(0)
        const toDate = new Date(to.year.id, to.month.id + 1)
        toDate.setDate(toDate.getDate())
        toDate.setUTCHours(0)
        toDate.setUTCMinutes(0)
        toDate.setUTCSeconds(0)
        const data = {
          account_id: account.id,
          type: account.type === 1 ? 1 : 2,
          date_from: fromDate,
          date_to: toDate,
        }
        const res = await post({ url: `account/accrual/all`, data })
        const { success, response } = await res.json()
        if (success) {
          setAccruals(response.accruals)
        }
      }
      onLoad()
    },
    []
  )

  const onClick = async e => {
    e.preventDefault()
    setAccruals(null)
    const fromDate = new Date(from.year.id, from.month.id)
    fromDate.setDate(fromDate.getDate() + 1)
    fromDate.setUTCHours(0)
    fromDate.setUTCMinutes(0)
    fromDate.setUTCSeconds(0)
    const toDate = new Date(to.year.id, to.month.id + 1)
    toDate.setDate(toDate.getDate())
    toDate.setUTCHours(0)
    toDate.setUTCMinutes(0)
    toDate.setUTCSeconds(0)
    const data = {
      account_id: account.id,
      type: account.type === 1 ? 1 : 2,
      date_from: fromDate,
      date_to: toDate,
    }
    const res = await post({ url: `account/accrual/all`, data })
    const { success, response } = await res.json()
    if (success) {
      setAccruals(response.accruals)
    }
  }

  const onOrder = (month, year) => dispatch(setDocsVisibilityAction({ month, year }))

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
    <div className={s.container}>
      <Form className={s.form} width="920px" title={`История начислений по ${account.type === 1 ? 'лицевому счету' : 'договору'}`}>
        <FormRow className={s.inner}>
          <FormRowTitle>Выберите период просмотра</FormRowTitle>
          <div className={s.bottom}>
            <div className={s.selects}>
              <Select
                className={s.yearSelect}
                options={fromYears}
                value={from.year}
                onChange={year => setFrom({...from, year })}
              />
              <Select
                className={s.monthSelect}
                options={fromMonths}
                value={from.month}
                onChange={month => setFrom({...from, month })}
              />
              <div className={s.line} />
              <Select
                className={s.yearSelect}
                options={toYears}
                value={to.year}
                onChange={year => setTo({...to, year })}
              />
              <Select
                className={s.monthSelect}
                options={toMonths}
                value={to.month}
                onChange={month => setTo({...to, month })}
              />
            </div>
            <Button text="Показать" className={s.button} onClick={onClick} />
          </div>
        </FormRow>
      </Form>
      {!accruals ? (
        <SpinnerIcon className={s.spinner} />
      ) : (
        <div className={s.result}>
          <div className={s.head}>
            <div className={s.year}>Год</div>
            <div className={s.month}>Месяц</div>
            <div className={s.creditStart}>Долг на<br />начало мес.</div>
            <div className={s.total}>Начислено</div>
            <div className={s.payed}>Оплачено</div>
            <div className={s.creditEnd}>Долг на<br />конец мес.</div>
            <div className={s.docs}>Платежные<br />документы</div>
          </div>
          {accruals.length ? (
            accruals.map(({ month: v }, i) => (
              <div key={i} className={s.row}>
                <div className={s.year}>{v.year}</div>
                <div className={s.month}>{monthNames[v.month - 1]}</div>
                <div className={s.creditStart}>
                  {formatCurrency(v.debt_start_month.sum)}
                  {(v.debt_start_month.fine || v.debt_start_month.state_duty) ? (
                    <div className={s.desc}>
                      {v.debt_start_month.fine ? (<div>Пени: {formatCurrency(v.debt_start_month.fine)}</div>) : null}
                      {v.debt_start_month.state_duty ? (<div>ГП: {formatCurrency(v.debt_start_month.state_duty)}</div>) : null}
                    </div>
                  ) : null}
                </div>
                <div className={s.total}>
                  {formatCurrency(v.accrued.sum)}
                  {(v.accrued.fine || v.accrued.state_duty) ? (
                    <div className={s.desc}>
                      {v.accrued.fine ? (<div>Пени: {formatCurrency(v.accrued.fine)}</div>) : null}
                      {v.accrued.state_duty ? (<div>ГП: {formatCurrency(v.accrued.state_duty)}</div>) : null}
                    </div>
                  ) : null}
                </div>
                <div className={s.payed}>
                  {formatCurrency(v.paid.sum)}
                  {(v.paid.fine || v.paid.state_duty) ? (
                    <div className={s.desc}>
                      {v.paid.fine ? (<div>Пени: {formatCurrency(v.paid.fine)}</div>) : null}
                      {v.paid.state_duty ? (<div>ГП: {formatCurrency(v.paid.state_duty)}</div>) : null}
                    </div>
                  ) : null}
                </div>
                <div className={s.creditEnd}>
                  {formatCurrency(v.debt_end_month.sum)}
                  {(v.debt_end_month.fine || v.debt_end_month.state_duty) ? (
                    <div className={s.desc}>
                      {v.debt_end_month.fine ? (<div>Пени: {formatCurrency(v.debt_end_month.fine)}</div>) : null}
                      {v.debt_end_month.state_duty ? (<div>ГП: {formatCurrency(v.debt_end_month.state_duty)}</div>) : null}
                    </div>
                  ) : null}
                </div>
                <div className={s.docs}>
                  <span onClick={() => onOrder(v.month, v.year)}>Заказать</span>
                </div>
              </div>
            ))
          ) : (
            <div className={s.empty}>Начисления отсутствуют</div>
          )}

        </div>
      )}

    </div>
  )
}

export default withStyles(s)(Accruals)