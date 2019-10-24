// @flow
import React from 'react'
import { Link } from 'react-router-dom'
import withStyles from 'isomorphic-style-loader/withStyles'
import SuccessIcon from 'assets/success.svg'

import s from './SuccessMessage.css'


function SuccessMessage(props: Props) {
  const { className, type, hidden, children, text } = props
  
  return (
    <div className={s.container}>
      <div className={s.top}>
        <SuccessIcon className={s.icon} />
        <div className={s.title}>Поздравляем!<br />Вы зарегистрировались.</div>
      </div>
      <div className={s.text}>
        Для завершения регистрации перейдите по ссылке из письма, отправленного на Ваш email.
      </div>
      <Link to="/login" className={s.link}>
        Войти в личный кабинет
      </Link>
    </div>
  )
}

export default withStyles(s)(SuccessMessage)