import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import GaugeIcon from 'assets/gauge.svg'
import SpinnerIcon from 'assets/spinner.svg'
import ArrowIcon from 'assets/arrow_h.svg'
import ClockIcon from 'assets/clock.svg'
import SuccessIcon from 'assets/success.svg'
import Button from 'components/form/Button/Button'
import Widget from 'components/account/DeviceReadingWidget/DeviceReadingWidget'

import s from './AccountDeviceReading.css'
import { post } from 'utils/api'
import { formatReadings } from 'utils/number'

const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const months = monthNames.map((value, id) => ({ id, value }))

const years = []

for (let i = new Date().getFullYear() - 5; i <= new Date().getFullYear(); i++) {
  years.push({ id: i, value: i })
}

function AccountDeviceReading(props) {
  const [counters, setCounters] = useState(null)
  const [index, setIndex] = useState(0)
  const [successShowed, setSuccessShowed] = useState(false)
  const [successedItems, setSuccessedItems] = useState([])
  const [error, setError] = useState(null)
  const [notChangedShowed, setNotChangedShowed] = useState(false)
  const [currentMonthWarningShowed, setCurrentMonthWarningShowed] = useState(false)
  const [lessThenPreviousShowed, setLessThenPreviousShowed] = useState(false)
  useEffect(
    () => {
      async function load() {
        const res = await post({ url: 'guest/account/counter/all', data: { account_number: props.account } })
        const { success, error, response } = await res.json()
        if (success) {
          setCounters(response.counts)
        }
      }
      load()
    },
    [props.account]
  )
  const send = async (data, newValue) => { 
    const res = await post({ url: `guest/account/counter/reading/new`, data: {
      type: 1,
      counter_id: data.id,
      new_meter_reading: newValue,
      account_number: props.account.toString(),
    }})
    const json = await res.json()

    if (json.success) {
      setCounters(json.response.counts)
      if (json.response.is_current_month === false) {
        setCurrentMonthWarningShowed(true)
      }
      setSuccessShowed(true)

      setSuccessedItems([ ...successedItems, data.id])
    } else {
      setError(json.error.description)
    }
  }

  return (
    <div className={s.container}>
      {/* <div className={s.empty}>
        <GaugeIcon />
        <p>Отсутствуют действующие приборы учета<br/>для передачи показаний</p>
      </div> */}
      <div className={s.content}>
        <div className={s.arrows}>
          <ArrowIcon 
            className={s.leftArrow} 
            onClick={() => {
              if (index > 0) {
                setIndex(index - 1)
              }
            }}
          />
          <ArrowIcon 
            className={s.rightArrow} 
            onClick={() => {
              if (index < counters.length - 1) {
                setIndex(index + 1)
              }
            }}
          />
        </div>
        <div className={s.widgets}>
          {counters ? (
            <div 
              className={s.list} 
              style={{ 
                width: 580 * counters.length,
                transform: `translateX(-${580 * index}px)` 
              }}>
            {counters.map(r => (
              <Widget 
                key={r.id} 
                data={r} 
                send={send}
                className={s.widget} 
                successed={successedItems.indexOf(r.id) !== -1}
                onNotChanged={data => setNotChangedShowed(data)}
                onLessThenPreviousShowed={(data) => setLessThenPreviousShowed(data)}
              />
            ))}
            </div>
          ) : (
            <SpinnerIcon className={s.spinner} />
          )}
          
          
        </div>
      </div>
      
      
      {successShowed && (
        <>
          <div className={s.overlay} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <SuccessIcon /><span>Показания переданы</span>
            </div>
            <div className={s.popupText}>
              Показания за <b>{monthNames[new Date().getMonth()]} {new Date().getFullYear()}</b><br/> по ПУ №{successShowed.number} успешно переданы
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
              Если вы нажмете на кнопку "Передать", будут переданы показания {formatReadings(notChangedShowed.new_meter_reading || notChangedShowed.meter_reading)}, равные показаниям за предыдущий период
            </div>
            <div className={s.popupButtons}>
              <Button variant="outlined" text="Отмена" onClick={() => setNotChangedShowed(false)} />
              <Button text="Передать" onClick={e => {
                send(notChangedShowed, notChangedShowed.new_meter_reading || notChangedShowed.meter_reading)
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
              По ПУ №{lessThenPreviousShowed.number} введенное показание меньше показания за предыдущий период.
            </div>
            <Button variant="outlined" text="Ok" fullWidth onClick={() => setLessThenPreviousShowed(false)} />
          </div>
        </>
      )}
    </div>
  )
}

export default withStyles(s)(AccountDeviceReading)