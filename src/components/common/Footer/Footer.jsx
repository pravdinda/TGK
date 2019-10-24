import React from 'react'
import withStyles from 'isomorphic-style-loader/withStyles'
import InfoIcon from 'assets/info.svg'

import s from './Footer.css'

function Footer() {
  return (
    <div className={s.container}>
      <a className={s.info} href="https://api-lk.tgc-2.ru/files/081019%20Руководство%20Web.pdf" target="_blank">
        <InfoIcon />
        <div>Справочная информация</div>
      </a>
      <div className={s.copy}>© ПАО "Территориальная генерирующая компания N2" 2015-2019</div>
    </div>
  )
}

export default withStyles(s)(Footer)