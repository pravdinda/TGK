import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import withStyles from 'isomorphic-style-loader/withStyles'
import ProfileIcon from 'assets/user.svg'
import LogoutIcon from 'assets/logout.svg'
import { logout } from 'utils/api'
import { userInfoLoaded } from 'actions/auth'

import s from './AccountWidget.css'

function AccountWidget(props) {
  const dispatch = useDispatch()
  const onLogout = useCallback(
    () => {
      logout()
      dispatch(userInfoLoaded(null))
    }
  )
  return (
    <div className={s.container}>
      <Link to="/profile"><ProfileIcon className={s.icon} /></Link>
      <div className={s.info}>
        <Link className={s.name} to="/accounts">
          {props.account.number}
          {props.account.is_archive && <span className={s.archive}>{props.account.type === 1 ? 'Архивный' : 'Расторгнутый'}</span>}
        </Link><br/>
        <span className={s.profile}>{props.account.address}</span>
      </div>
      <LogoutIcon className={s.logout} onClick={onLogout} />
    </div>
  )
}

export default withStyles(s)(AccountWidget)