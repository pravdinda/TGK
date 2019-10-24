import React from 'react'
import { Link } from 'react-router-dom'
import useReactRouter from 'use-react-router'
import withStyles from 'isomorphic-style-loader/withStyles'
import ArrowIcon from 'assets/arrow_b.svg'
import CloseIcon from 'assets/close.svg'

import s from './Header.css'

function Header(props) {
  const { history } = useReactRouter()
  
  return (
    <div className={s.container}>
      <div className={s.inner}>
        <div className={s.title}>{props.title}</div>
        <div className={s.actions}>
          <a onClick={history.goBack} className={s.action}>
            <ArrowIcon />
            <span>Назад</span>
          </a>
          <Link to="/accounts" className={s.action}>
            <CloseIcon />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default withStyles(s)(Header)