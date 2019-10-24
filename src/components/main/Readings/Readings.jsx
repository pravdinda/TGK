import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import withStyles from 'isomorphic-style-loader/withStyles'
import Form from 'components/form/Form/Form'
import Widget from 'components/account/DeviceReadingWidgetWide/DeviceReadingWidgetWide'
import SpinnerIcon from 'assets/spinner.svg'
import RefreshIcon from 'assets/refresh.svg'
import { loadDevices, setOldDeviceVisibilityAction } from 'actions/account'

import s from './Readings.css'

function Readings() {
  const account = useSelector(state => state.account)
  const devices = useSelector(state => state.devices)
  const dispatch = useDispatch()
  
  const onUpdate = counts => {
    dispatch(loadDevices(counts))
  }
  
  const filtered = devices ? devices.filter(d => d.reason_blocking !== 1) : null
  const oldShowed = !account.is_archive
  return (
    <div className={s.container}>    
      <Form title="Показания приборов учета" width="100%" className={s.form}>
        {oldShowed && <div className={s.beforePU} onClick={() => dispatch(setOldDeviceVisibilityAction(true))}>
          <RefreshIcon />
          <span>Ранее установленные ПУ</span>
        </div>}
        {filtered ? (
          <>
            {filtered.length ? (
              filtered.map(r => (
                <Widget account={account} key={r.id} data={r} className={s.widget} onUpdate={onUpdate} />
              ))
            ) : (
              <div className={s.empty}>Нет показаний</div>
            )}
          </>
        ) : (
          <SpinnerIcon className={s.spinner} />
        )} 
      </Form>  
    </div>
  )
}

export default withStyles(s)(Readings)