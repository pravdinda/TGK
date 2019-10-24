// @flow
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import moment from 'moment'
import withStyles from 'isomorphic-style-loader/withStyles'
import CloseIcon from 'assets/close.svg'
import ClockIcon from 'assets/clock.svg'
import { formatReadings } from 'utils/number';
import DropletIcon from 'assets/droplet.svg'
import { setSelectedReadingsDevice, setOldDeviceVisibilityAction } from 'actions/account'

import s from './OldDevices.css'


type Props = {
  onClose: Function,
  hidden: boolean,
  account: any,
}

const types = [
  'Горячая вода',
  'Отопление',
  'Распределитель отопления'
]

function OldDevices(props: Props) {
  const { onClose, hidden } = props
  const dispatch = useDispatch()
  const devices = useSelector(state => state.devices)
  const filtered = devices ? devices.filter(d => d.reason_blocking === 1) : null

  useEffect(
    () => {
      if (!hidden) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'visible'
      }
    },
    [hidden]
  )

  useEffect(
    () => {
      return () => {
        document.body.style.overflow = 'visible'
      }
    },
    []
  )

  return (
    <div className={cx(s.container, { [s.hidden]: hidden } )}>
      <div className={s.overlay} />
      <div className={s.window}>
        <div className={s.title}>Ранее установленные приборы учета</div>
        <div className={s.content}>
          {filtered && (filtered.length > 0 ? filtered.map(d => (
            <div key={d.id} className={s.device}>
              <div className={s.left}>
                <div className={s.reason}>Прибор учета вышел из строя</div>
                <div className={s.info}>
                  <div className={s.row}>
                    <span>Номер прибора учета:</span>
                    {d.number}
                  </div>
                  <div className={s.row}>
                    <span>Последние показания:</span>
                    {d.new_meter_reading || d.meter_reading === null ? '—' : formatReadings(d.new_meter_reading || d.meter_reading)}
                  </div>
                  <div className={s.row}>
                    <span>Дата показаний:</span>
                    {d.new_date_reading || d.date_reading === null ? '—' : moment(d.new_date_reading || d.date_reading).format('DD.MM.YYYY')}
                  </div>
                </div>
                <div className={s.bottom}>
                  <span className={s.link} onClick={() => {
                    dispatch(setSelectedReadingsDevice(d))
                  }}>
                    <ClockIcon />
                    <span>История показаний</span>
                  </span>
                </div>
              </div>
              <div className={s.right}>
                <div className={s.number}>
                  ПУ<br />№{d.number}
                </div>
                <div className={s.reading}>
                  <span>{d.new_meter_reading || d.meter_reading === null ? '—' : formatReadings(d.new_meter_reading || d.meter_reading)}</span>
                </div>
                <div className={s.type}>
                  <div>{types[d.type - 1]}</div>
                  <DropletIcon />
                </div>
              </div>
            </div>
          )) : (
            <div className={s.empty}>Ранее установленные приборы учета отсутствуют</div>
          ))}
        </div>
        <CloseIcon className={s.close} onClick={onClose} />
      </div>
    </div>
  )
}

export default withStyles(s)(OldDevices)