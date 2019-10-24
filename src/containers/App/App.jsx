import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import withStyles from 'isomorphic-style-loader/withStyles'
import SuccessIcon from 'assets/success.svg'
import FailIcon from 'assets/fail.svg'
import s from './App.css'
import Login from 'components/auth/Login/Login'
import Register from 'components/auth/Register/Register'
import ConfirmEmail from 'components/common/ConfirmEmail/ConfirmEmail'
import GuestService from 'containers/GuestService/GuestService'
import SuccessPayment from 'components/common/SuccessPayment/SuccessPayment'
import FailPayment from 'components/common/FailPayment/FailPayment'
import Popup from 'components/common/Popup/Popup'
import Form from 'components/form/Form/Form'
import Button from 'components/form/Button/Button'
import AltPay from 'containers/AltPay/AltPay'
import Accounts from 'containers/Accounts/Accounts'
import Profile from 'containers/Profile/Profile'
import Main from 'containers/Main/Main'
import withGuest from 'hocs/withGuest'
import withAuth from 'hocs/withAuth'
import SpinnerIcon from 'assets/spinner.svg'
import { loadUserInfo } from 'services/auth'
import { loggedIn, userInfoLoaded } from 'actions/auth'
import { toggleSuccessPay, toggleFailPay } from 'actions/common'
import { setConfirmEmailVisibility } from 'actions/account'
import { getCities } from 'services/cities'
import { post } from 'utils/api'


function App() {
  const [ready, setReady] = useState(false)
  const dispatch = useDispatch()
  const helpWindowShowed = useSelector(state => state.helpWindowShowed)
  const successPayShowed = useSelector(state => state.successPayShowed)
  const confirmEmailShowed = useSelector(state => state.confirmEmailShowed)
  const failPayShowed = useSelector(state => state.failPayShowed)

  
  useEffect(
    () => {
      async function onLoad() {
        await dispatch(getCities())
        // post({ url: 'user/debug/delete', data: { user_id: 170 } })
        try {
          await dispatch(loadUserInfo())
          await dispatch(loggedIn())
        } catch(e) {
          dispatch(userInfoLoaded(null))
        }
        setReady(true)
      }
      onLoad()
    },
    []
  )
  useEffect(
    () => {
      if (helpWindowShowed) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'visible'
      }
    },
    [helpWindowShowed]
  )
  return (
    <div className={s.container}>
      {ready ? (
        <>
          <Switch>
            <Redirect exact from="/" to="/login" />
            <Route path="/login" exact component={withGuest(Login)} />
            <Route path="/register" exact component={withGuest(Register)} />
            <Route path="/guest-service" component={withGuest(GuestService)} />
            <Route path="/alt-pay" exact component={withGuest(AltPay)} />
            <Route path="/accounts" component={withAuth(Accounts)} />
            <Route path="/account/:number" component={withAuth(Main)} />
            <Route path="/profile" component={withAuth(Profile)} />
            <Route path="/success-confirm" component={ConfirmEmail} />
            <Route path="/success-payment" component={SuccessPayment} />
            <Route path="/fail-payment" component={FailPayment} />
          </Switch>   
          {successPayShowed && (
            <Popup>
              <Form width="380px">
                <div className={s.popupTitle}>
                  <SuccessIcon />
                  <span>Платёж выполнен!</span>
                </div>
                <Button 
                  fullWidth
                  text="Ok"
                  variant="outlined"
                  onClick={e => {
                    e.preventDefault()
                    dispatch(toggleSuccessPay(false))
                  }}
                />
              </Form>
            </Popup>
          )}
          {failPayShowed && (
            <Popup>
              <Form width="420px">
                <div className={s.popupTitle}>
                  <FailIcon />
                  <span>Платёж не выполнен!</span>
                </div>
                <Button 
                  fullWidth
                  text="Ok"
                  variant="outlined"
                  onClick={e => {
                    e.preventDefault()
                    dispatch(toggleFailPay(false))
                  }}
                />
              </Form>
            </Popup>
          )}
          {confirmEmailShowed && (
            <Popup>
              <Form width="425px">
                <div className={s.popupTitle}>
                  <SuccessIcon />
                  <span>Ваша почта успешно<br />подтверждена!</span>
                </div>
                <Button 
                  fullWidth
                  text="Ok"
                  variant="outlined"
                  onClick={e => { 
                    e.preventDefault()
                    dispatch(setConfirmEmailVisibility(false))
                  }}
                />
              </Form>
            </Popup>
          )}
        </>   
      ) : (
        <div className={s.spinner}>
          <SpinnerIcon />
        </div>
      )}
      
    </div>
  )
}

export default withStyles(s)(App)