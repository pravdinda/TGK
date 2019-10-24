import React from 'react'
import cx from 'classnames'
import moment from 'moment'
import withStyles from 'isomorphic-style-loader/withStyles'
import DropletIcon from 'assets/droplet.svg'
import { formatReadings } from 'utils/number'

import s from './DeviceReadingWidgetSmall.css'

const types = [
  'Горячая вода',
  'Отопление',
  'Распределитель отопления'
]

function DeviceReadingWidgetSmall(props) {
  const { data } = props
  return (
    <div className={cx(s.container, props.className)}>
      <div className={s.top}>
        <div className={s.type}>
          <DropletIcon />
          <span>{types[data.type - 1]}</span>
        </div>
        <div className={s.number}>ПУ № {data.number}</div>
      </div>
      <div className={s.readings}>
        <div className={s.reading}>
          <div className={s.readingLabel}>Последние показания</div>
          <div className={s.readingValue}>{(data.new_meter_reading || data.meter_reading) === null ? '—' : formatReadings(data.new_meter_reading || data.meter_reading || 0.0)}</div>
        </div>
        <div className={s.reading}>
          <div className={s.readingLabel}>Дата</div>
          <div className={s.readingValue}>{(data.new_date_reading || data.date_reading) === null ? '—' : moment(data.new_date_reading || data.date_reading).format('DD.MM.YYYY')}</div>
        </div>
        <div className={s.time}>
          Срок поверки: {moment(data.date_check).format('DD.MM.YYYY')}
        </div>
      </div>
    </div>
  )
}

export default withStyles(s)(DeviceReadingWidgetSmall)