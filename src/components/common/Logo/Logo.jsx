import React from 'react'
import LogoIcon from 'assets/logo.svg'
import withStyles from 'isomorphic-style-loader/withStyles'
import s from './Logo.css'


function Logo() {
  return (
    <div className={s.container}>
      <LogoIcon className={s.icon} />
      <div className={s.line} />
      <div className={s.text}>Личный кабинет</div>
    </div>
  )
}

export default withStyles(s)(Logo)