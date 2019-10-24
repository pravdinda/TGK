import React from 'react'
import { NavLink } from 'react-router-dom'
import withStyles from 'isomorphic-style-loader/withStyles'
import s from './Navigation.css'

function Navigation() {
  return (
    <ul className={s.container}>
      <li className={s.elem}>
        <NavLink 
          className={s.link} 
          activeClassName={s.activeLink} 
          to="/login"
        >Вход</NavLink>
      </li>
      <li className={s.elem}>
        <NavLink 
          className={s.link} 
          activeClassName={s.activeLink} 
          to="/register"
        >Регистрация</NavLink>
      </li>
      <li className={s.elem}>
        <NavLink 
          className={s.link} 
          activeClassName={s.activeLink} 
          to="/guest-service"
        >Сервис без регистрации</NavLink>
      </li>
      <li className={s.elem}>
        <NavLink 
          className={s.link} 
          activeClassName={s.activeLink} 
          to="/alt-pay"
        >Альтернативные способы оплаты</NavLink>
      </li>
    </ul>
  )
}

export default withStyles(s)(Navigation)