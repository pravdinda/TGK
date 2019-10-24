import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import cx from 'classnames'
import moment from 'moment'
import withStyles from 'isomorphic-style-loader/withStyles'
import DropletIcon from 'assets/droplet.svg'
import Button from 'components/form/Button/Button'
import ClockIcon from 'assets/clock.svg'
import AlertIcon from 'assets/alert.svg'
import SuccessIcon from 'assets/success.svg'
import { setSelectedReadingsDevice } from 'actions/account'
import NumberFormat from 'react-number-format';
import { post } from 'utils/api'
import { formatReadings } from 'utils/number'


import s from './DeviceReadingWidgetWide.css'

const types = [
  'Горячая вода',
  'Отопление',
  'Распределитель отопления'
]

const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

function DeviceReadingWidgetWide(props) {
  const { data, onUpdate, account } = props
  const dispatch = useDispatch()
  let lastValue = data.new_meter_reading || data.meter_reading
  const [newValue, setNewValue] = useState(lastValue)
  const [newDate, setNewDate] = useState(data.new_date_reading || data.date_reading)
  const [successShowed, setSuccessShowed] = useState(false)
  const [successMessageShowed, setSuccessMessageShowed] = useState(false)
  const [error, setError] = useState(null)
  const [notChangedShowed, setNotChangedShowed] = useState(false)
  const [currentMonthWarningShowed, setCurrentMonthWarningShowed] = useState(false)
  const [lessThenPreviousShowed, setLessThenPreviousShowed] = useState(false)
  

  const isActive = data.is_active
  let reason

  if (!isActive) {
    switch(data.reason_blocking) {
      case 1:
        reason = 'Ввод недоступен в связи с тем, что счетчик является архивным.'
        break
      case 2:
        reason = 'Ввод недоступен в связи с истечением межповерочного интервала.'
        break
      case 3:
        reason = 'Ввод недоступен в связи с отсутствием показаний за последние 12 месяцев.'
        break
      case 4:
        reason = 'Ввод недоступен в связи с тем, что лицевой счет является архивным.'
        break
    }
  }

  useEffect(
    () => {
      setNewValue(lastValue)
    },
    [lastValue]
  )

  useEffect(
    () => {
      setNewDate(data.new_date_reading || data.date_reading)
    },
    [data.new_date_reading || data.date_reading]
  )

  const onSend = async e => {
    e.preventDefault()
    if (newValue === data.meter_reading) {
      setNotChangedShowed(true)
    } else if (newValue < data.meter_reading) {
      setLessThenPreviousShowed(true)
    } else {
      send(e)
    }
  }

  const send = async e => {
    e.preventDefault()
    const res = await post({ url: `account/counter/reading/new`, data: {
      type: account.type === 1 ? 1 : 2,
      counter_id: data.id,
      new_meter_reading: newValue,
      account_id: account.id
    }})
    const json = await res.json()

    if (json.success) {
      onUpdate(json.response.counts)
      if (json.response.is_current_month === false) {
        setCurrentMonthWarningShowed(true)
      }
      setSuccessShowed(true)
      setSuccessMessageShowed(true)
      setNewDate(new Date())
    } else {
      setError(json.error.description)
    }
  }
  let isChange = false
  const newMeterDate = data.new_date_reading && new Date(data.new_date_reading)
  if (newMeterDate) {
    const today = new Date()
    if ((today.getMonth() === newMeterDate.getMonth()) && (today.getFullYear() === newMeterDate.getFullYear())) {
      isChange = today.getDate() < 26
    }
  }

  return (
    <div className={cx(s.container, props.className)}>
      <div className={s.top}>
        <div className={s.type}>
          <DropletIcon />
          <span>{types[data.type - 1]}</span>
        </div>
        <div className={s.number}>ПУ №{data.number}</div>
        <div className={s.history} onClick={() => dispatch(setSelectedReadingsDevice(data))}>
          <ClockIcon />
          История показаний
        </div>
      </div>
      <div className={s.bottom}>
        <div className={s.new}>
          <div className={s.newTitle}>Новые показания</div>
          <NumberFormat 
            className={s.newInput} 
            thousandSeparator=" " 
            value={newValue}
            disabled={!isActive}
            decimalScale={2}
            fixedDecimalScale
            onValueChange={val => {
              setNewValue(val.floatValue)
            }}
          />
        </div>
        
        <Button 
          className={s.button} 
          text={isChange ? 'Изменить показания' : 'Отправить'} 
          onClick={onSend}
          disabled={!isActive || !newValue}
        />
        
        <div className={s.readings}>
          <div className={s.reading}>
            <span className={s.readingLabel}>Последние показания:</span>
            <span className={s.readingValue}>{lastValue === null ? '—' : formatReadings(lastValue || 0.0)}</span>
          </div>
          <div className={s.reading}>
            <span className={s.readingLabel}>Дата:</span>
            <span className={s.readingValue}>{newDate === null ? '—' : moment(newDate).format('DD.MM.YYYY')}</span>
          </div>
        </div>
        {/* <div className={s.warning}>
          <AlertIcon />
          Ввод недоступен в связи с тем, что выбранный договор счет является расторгнутым. Подробнее 
        </div> */}
      </div>
      {isChange && (
        <div className={s.message}>
          <SuccessIcon />
          <p>Повторно показания можно подавать в течении всего расчетного периода:
к расчету будут приняты последние введенные на момент расчета показания.</p>
        </div>
      )}
      {reason && (
        <div className={s.message}>
          <AlertIcon />
          <p>{reason}</p>
        </div>
      )}
      {successShowed && (
        <>
          <div className={s.overlay} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <SuccessIcon /><span>Показания переданы</span>
            </div>
            <div className={s.popupText}>
              Показания за <b>{monthNames[new Date().getMonth()]} {new Date().getFullYear()}</b><br/> по ПУ №{data.number} успешно переданы
            </div>
            <Button variant="outlined" text="Ok" fullWidth onClick={() => setSuccessShowed(false)} />
          </div>
        </>
      )}
      {error && (
        <>
          <div className={s.overlay} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <span>Ошибка</span>
            </div>
            <div className={s.popupText}>
              {error}
            </div>
            <Button variant="outlined" text="Ok" fullWidth onClick={() => setError(null)} />
          </div>
        </>
      )}
      {notChangedShowed && (
        <>
          <div className={s.overlay} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <span>Показания не изменились?</span>
            </div>
            <div className={s.popupText}>
              Если вы нажмете на кнопку "Передать", будут переданы показания {formatReadings(newValue)}, равные показаниям за предыдущий период
            </div>
            <div className={s.popupButtons}>
              <Button variant="outlined" text="Отмена" onClick={() => setNotChangedShowed(false)} />
              <Button text="Передать" onClick={e => {
                send(e)
                setNotChangedShowed(false)
              }} />
            </div>
          </div>
        </>
      )}
      {currentMonthWarningShowed && (
        <>
          <div className={s.overlay} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <span>Внимание!</span>
            </div>
            <div className={s.popupText}>
              Ваши показания могут не войти в расчет текущего месяца и будут приняты к расчету в следующем.
            </div>
            <Button variant="outlined" text="Ok" fullWidth onClick={() => setCurrentMonthWarningShowed(false)} />
          </div>
        </>
      )}
      {lessThenPreviousShowed && (
        <>
          <div className={s.overlay} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <span>Внимание!</span>
            </div>
            <div className={s.popupText}>
              По ПУ №{data.number} введенное показание меньше показания за предыдущий период.
            </div>
            <Button variant="outlined" text="Ok" fullWidth onClick={() => setLessThenPreviousShowed(false)} />
          </div>
        </>
      )}
    </div>
  )
}

export default withStyles(s)(DeviceReadingWidgetWide)