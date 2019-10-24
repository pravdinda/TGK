import React from 'react'
import withStyles from 'isomorphic-style-loader/withStyles'

import s from './ObjectWidget.css'

function ObjectWidget(props) {
  const { data, index } = props
  console.log(data)
  return (
    <div className={s.container}>
      <div className={s.row}>
        <div className={s.label}>Объект {index + 1}</div>
        <div className={s.address}>{data.address}</div>
      </div>
      <div className={s.row}>
        <div className={s.label}>Нагрузка на отопление</div>
        <div className={s.value}>{data.heat}</div>
      </div>
      <div className={s.row}>
        <div className={s.label}>Нагрузка на ГВС</div>
        <div className={s.value}>{data.hwater}</div>
      </div>
      <div className={s.row}>
        <div className={s.label}>Нагрузка на вентиляцию</div>
        <div className={s.value}>{data.vent}</div>
      </div>
    </div>
  )
}

export default withStyles(s)(ObjectWidget)