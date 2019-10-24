import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import moment from 'moment'
import withStyles from 'isomorphic-style-loader/withStyles'
import DropletIcon from 'assets/droplet.svg'
import Form from 'components/form/Form/Form'
import FormRow from 'components/form/FormRow/FormRow'
import FormGroup from 'components/form/FormGroup/FormGroup'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import Button from 'components/form/Button/Button'
import { formatReadings } from 'utils/number'
import AlertIcon from 'assets/alert.svg'
import SuccessIcon from 'assets/success.svg'
import NumberFormat from 'react-number-format';

import { post } from 'utils/api'
const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

import s from './DeviceReadingWidget.css'

function DeviceReadingWidget(props) {
  const { 
    data, onNotChanged, onLessThenPreviousShowed, send, successed
  } = props
  
  let lastValue = data.new_meter_reading || data.meter_reading
  const [newValue, setNewValue] = useState(lastValue)

  
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

  let isChange = false
  const newMeterDate = data.new_date_reading && new Date(data.new_date_reading)
  if (newMeterDate) {
    const today = new Date()
    if ((today.getMonth() === newMeterDate.getMonth()) && (today.getFullYear() === newMeterDate.getFullYear())) {
      isChange = today.getDate() < 26
    }
  }

  const onSend = async e => {
    e.preventDefault()
    if (newValue === data.meter_reading) {
      onNotChanged(data)
    } else if (newValue < data.meter_reading) {
      onLessThenPreviousShowed(data)
    } else {
      send(data, newValue)
    }
  }
  
  return (
    <div className={cx(s.container, props.className)}>
      <div className={s.top}>
        <div className={s.type}>
          <DropletIcon />
          <span>Горячая вода</span>
        </div>
        <div className={s.number}>ПУ №{data.number}</div>
      </div>
      <div className={s.readings}>
        <div className={s.reading}>
          <div className={s.readingLabel}>Последние показания</div>
          <div className={s.readingValue}>{lastValue === null ? '—' : formatReadings(lastValue || 0.0)}</div>
        </div>
        <div className={s.reading}>
          <div className={s.readingLabel}>Показания предыдущего периода</div>
          <div className={s.readingValue}>{data.meter_reading === null ? '—' : formatReadings(data.meter_reading || 0.0)}</div>
        </div>
        <div className={s.reading}>
          <div className={s.readingLabel}>Дата</div>
          <div className={s.readingValue}>{(data.new_date_reading || data.date_reading) === null ? '—' : moment(data.new_date_reading || data.date_reading).format('DD.MM.YYYY')}</div>
        </div>
        <div className={s.reading}>
          <div className={s.readingLabel}>Дата</div>
          <div className={s.readingValue}>{data.date_reading === null ? '—' : moment(data.date_reading).format('DD.MM.YYYY')}</div>
        </div>
      </div>
      {successed ? (
        <div className={s.success}>
          <SuccessIcon /> 
          <div className={s.successInfo}>
            <div className={s.successTitle}>Показания переданы</div>
            <div className={s.successText}>Показания за {monthNames[(new Date).getMonth()]} по ПУ №{data.number} успешно переданы</div>
          </div>
        </div>
      ) : (
        reason ? (
          <div className={s.message}>
            <AlertIcon />
            <p>{reason}</p>
          </div>
        ) : (
          <Form className={s.new}>
            <FormGroup className={s.group}>
              <FormRow>
                <FormRowTitle>Новые показания</FormRowTitle>
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
                
              </FormRow>
              <Button onClick={onSend} disabled={!isActive || !newValue} text={isChange ? 'Изменить показания' : 'Отправить'}  />
            </FormGroup>
          </Form>
        )
      )}
    </div>
  )
}

export default withStyles(s)(DeviceReadingWidget)