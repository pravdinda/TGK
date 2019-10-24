import React from 'react'
import { Switch, Route } from 'react-router-dom'
import useReactRouter from 'use-react-router';
import withStyles from 'isomorphic-style-loader/withStyles'
import Header from 'components/account/Header/Header'
import Footer from 'components/common/Footer/Footer'
import AccountsAndContracts from 'components/account/AccountsAndContracts/AccountsAndContracts'

import s from './Accounts.css'

function Accounts() {
  const { match } = useReactRouter()
  return (
    <div className={s.container}>
      <Header />
      <div className={s.content}>
        <Switch>
          <Route path={`${match.path}`} exact component={AccountsAndContracts} />
        </Switch>
      </div>
      <Footer />
    </div>
  )
}

export default withStyles(s)(Accounts)