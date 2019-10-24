import React from 'react'
import cx from 'classnames'
import { NavLink } from 'react-router-dom'
import withStyles from 'isomorphic-style-loader/withStyles'
import AccountWidget from 'components/auth/AccountWidget/AccountWidget'

import s from './Header.css'

function Header(props) {
  const { path, item } = props
  return (
    <div className={s.container}>
      <nav className={s.navigation}>
        <NavLink
          className={s.link}
          activeClassName={s.activeLink}
          exact
          to={path}
        >Общие сведения</NavLink>
        <NavLink
          className={s.link}
          activeClassName={s.activeLink}
          to={`${path}/accruals`}
        >Начисления</NavLink>
        {item.type !== 3 && (
          <NavLink
            className={s.link}
            activeClassName={s.activeLink}
            to={`${path}/readings`}
          >Показания</NavLink>
        )}
        
      </nav>
      <AccountWidget account={item} />
    </div>
  )
}

export default withStyles(s)(Header)