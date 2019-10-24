import React from 'react'
import withStyles from 'isomorphic-style-loader/withStyles'
import Icon from 'assets/info-1.svg'

import s from './Notification.css'

function Notification() {
  return (
    <div className={s.container}>
      <div className={s.top}>
        <Icon className={s.icon} />
        <div className={s.title}>Информация для владельцев жилых помещений</div>
      </div>
      <div className={s.text}>
        Личный кабинет позволяет работать только
        с лицевыми счетами граждан, проживающих
        по адресам, указанным в <a target="_blank" href="https://lk1.tgc-2.ru/help/00.shtml">справочнике домов</a>.
      </div>
    </div>
  )
}

export default withStyles(s)(Notification)