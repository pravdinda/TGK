import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import moment from 'moment'
import CloseIcon from 'assets/close.svg'
import { post } from 'utils/api'
import FormRow from 'components/form/FormRow/FormRow'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import Select from 'components/form/Select/Select'
import Button from 'components/form/Button/Button'
import SpinnerIcon from 'assets/spinner.svg'
import { formatReadings } from 'utils/number'

import s from './ReadingsHistory.css'

const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const months = monthNames.map((value, id) => ({ id, value }))

const years = []

for (let i = new Date().getFullYear() - 5; i <= new Date().getFullYear(); i++) {
  years.push({ id: i, value: i })
}

type Props = {
  onClose: Function,
  hidden: boolean,
  device: any,
  account: any,
}

function ReadingsHistory(props: Props) {
  const { onClose, hidden, device, account } = props
  const [readings, setReadings] = useState([])
  const [loading, setLoading] = useState(false)
  const today = new Date()
  const initialYear = years.find(y => y.id === today.getFullYear())
  const initialFromYear = years.find(y => y.id === today.getFullYear() - 1)
  const initialMonth = months.find(m => m.id === today.getMonth())
  const [from, setFrom] = useState({ year: initialFromYear, month: initialMonth })
  const [to, setTo] = useState({ year: initialYear, month: initialMonth })
  const [last, setLast] = useState(null)

  useEffect(
    () => {
      async function loadReadings() {
        setLoading(true)
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
          type: account.type === 1 ? 1 : 2,
          account_id: account.id,
          counter_id: device.id,
          date_from: fromDate,
          date_to: toDate,
        }
        const res = await post({ url: `account/counter/reading/all`, data })
        const { success, response, error } = await res.json()
        if (success) {
          const data = []
          if (response.new_date_reading) {
            const last = { date_reading: response.new_date_reading, meter_reading: response.new_meter_reading, method_sending: response.new_method_sending }
            const date = new Date(last.date_reading)
            if (date >= fromDate && date <= toDate) {
              setLast(last)
            } else {
              setLast(null)
            }
          } else {
            setLast(null)
          }
          setReadings([...data, ...response.meter_readings])
        }
        setLoading(false)
      }

      if (device) {
        setFrom({ year: initialFromYear, month: initialMonth })
        setTo({ year: initialYear, month: initialMonth })
        setReadings([])
        loadReadings()
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'visible'
      }
    },
    [device]
  )

  const onClick = async e => {
    setLoading(true)
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
      type: account.type === 1 ? 1 : 2,
      account_id: account.id,
      counter_id: device.id,
      date_from: fromDate,
      date_to: toDate,
    }
    const res = await post({ url: `account/counter/reading/all`, data })
    const { success, response, error } = await res.json()
    if (success) {
      const data = []
      if (response.new_date_reading) {
        const last = { date_reading: response.new_date_reading, meter_reading: response.new_meter_reading, method_sending: response.new_method_sending }
        const date = new Date(last.date_reading)
        if (date >= fromDate && date <= toDate) {
          setLast(last)
        } else {
          setLast(null)
        }
      } else {
        setLast(null)
      }
      setReadings([...data, ...response.meter_readings])
    }
    setLoading(false)
  }

  useEffect(
    () => {
      return () => document.body.style.overflow = 'visible'
    },
    []
  )

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

  let filtered = null
  if (!loading) {
    filtered = readings
    if (last) {
      filtered = readings.filter(r => {
        if (r.date_reading === last.date_reading && r.meter_reading === last.meter_reading && last.method_sending === r.method_sending) {
          return false
        }
        return true
      })
    }
  }
  return (
    <div className={cx(s.container, { [s.hidden]: hidden } )}>
      <div className={s.overlay} />
      <div className={s.window}>
        <CloseIcon className={s.close} onClick={onClose} />
        {device ? (
          <div className={s.top}>
            <div className={s.title}>История показаний прибора учета № {device.number}</div>
            <div className={s.intro}>Выберите период просмотра. По умолчанию выбирается период за последние 12 месяцев
</div>
            <div className={s.form}>
              <FormRow className={s.inner}>
                <FormRowTitle>Выберите период просмотра</FormRowTitle>

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
                  <Button text="Выбрать" fullWidth className={s.button} onClick={onClick} />
              </FormRow>
            </div>
          </div>
        ) : null}
         {device ? (
          <div className={s.bottom}>
            {loading ? <div className={s.spinner}><SpinnerIcon /></div> : (
              <div className={s.table}>
                <div className={s.head}>
                  <div className={s.date}>Дата</div>
                  <div className={s.value}>Показания</div>
                  <div className={s.source}>Источник</div>
                </div>
                <div className={s.result}>
                  {last && (
                    <div className={s.row}>
                      <div className={s.date}>{moment(last.date_reading).format('DD.MM.YYYY')}</div>
                      <div className={s.value}>{formatReadings(last.meter_reading)}</div>
                      <div className={s.source}>{last.method_sending}</div>
                    </div>
                  )}
                  {filtered.map((r, i) => (
                    <div key={i} className={s.row}>
                      <div className={s.date}>{moment(r.date_reading).format('DD.MM.YYYY')}</div>
                      <div className={s.value}>{formatReadings(r.meter_reading)}</div>
                      <div className={s.source}>{r.method_sending}</div>
                    </div>
                  ))}
                  {!last && filtered.length === 0 && (
                    <div className={s.empty}>Показания отсутствуют</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}


      </div>

    </div>
  )
}


export default withStyles(s)(ReadingsHistory)