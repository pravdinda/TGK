import React from 'react'
import { Route, Switch } from 'react-router-dom'
import useReactRouter from 'use-react-router';
import withStyles from 'isomorphic-style-loader/withStyles'
import Header from 'components/profile/Header/Header'
import Footer from 'components/common/Footer/Footer'
import ProfileInfo from 'components/profile/ProfileInfo/ProfileInfo'
import ProfileEdit from 'components/profile/ProfileEdit/ProfileEdit'

import s from './Profile.css'

function Profile() {
  const { match, location } = useReactRouter()
  return (
    <div className={s.container}>
      <Header title={location.pathname === '/profile' ? 'Профиль пользователя' : 'Редактировать профиль'} />
      <div className={s.content}>
        <Switch>
          <Route path={`${match.path}`} exact component={ProfileInfo} />
          <Route path={`${match.path}/edit`} exact component={ProfileEdit} />
        </Switch>
      </div>
      <Footer />
    </div>
  )
}

export default withStyles(s)(Profile)