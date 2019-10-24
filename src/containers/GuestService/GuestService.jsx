// @flow
import React from 'react'
import { Switch, Route } from 'react-router-dom'
import useReactRouter from 'use-react-router';
import withStyles from 'isomorphic-style-loader/withStyles'
import AccountForm from 'components/account/AccountForm/AccountForm'
import AccountDetail from 'components/account/AccountDetail/AccountDetail'

import s from './GuestService.css'

function GuestService() {
  const { match } = useReactRouter()
  return (
    <div className={s.container}>
      <Switch>
        <Route path={`${match.path}`} exact component={AccountForm} />
        <Route path={`${match.path}/:account`} component={AccountDetail} />
      </Switch>
    </div>
  )
}

export default withStyles(s)(GuestService)