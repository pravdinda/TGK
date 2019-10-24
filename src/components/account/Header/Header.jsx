import React, { useState } from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import LogoImage from 'assets/logo.png'
import ProfileWidget from 'components/auth/ProfileWidget/ProfileWidget'

import s from './Header.css'

function Header() {
  return (
    <div className={s.container}>
      <div className={s.inner}>
        <div className={s.left}>
          <img src={LogoImage} className={s.logo} />
          <div className={s.text}>
            <div>Мои счета и договоры</div>
            <p>Выберите учетную запись</p>
          </div>
        </div>
        <ProfileWidget />
      </div>
    </div>
  )
}

export default withStyles(s)(Header)