import React from 'react'
import withStyles from 'isomorphic-style-loader/withStyles'
import Logo from 'components/common/Logo/Logo'
import Navigation from 'components/common/Navigation/Navigation'

import s from './Header.css'

function Header() {
  return (
    <div className={s.container}>
      <Logo />
      <Navigation />
    </div>
  )
}

export default withStyles(s)(Header)