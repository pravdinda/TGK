import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import withStyles from 'isomorphic-style-loader/withStyles'
import ProfileIcon from 'assets/user.svg'
import LogoutIcon from 'assets/logout.svg'
import { logout } from 'utils/api'
import { userInfoLoaded } from 'actions/auth'

import s from './ProfileWidget.css'

function ProfileWidget() {
  const dispatch = useDispatch()
  const onLogout = useCallback(
    () => {
      logout()
      dispatch(userInfoLoaded(null))
    }
  )
  const info = useSelector(state => state.userInfo)
  return (
    <div className={s.container}>
      <Link to="/profile"><ProfileIcon className={s.icon} /></Link>
      <Link to="/profile" className={s.info}>
        <span className={s.profile}>Профиль</span><br/>
        <span className={s.name}>{info.name}</span>
      </Link>
      <LogoutIcon className={s.logout} onClick={onLogout} />
    </div>
  )
}

export default withStyles(s)(ProfileWidget)