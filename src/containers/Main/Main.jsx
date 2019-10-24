import React, { useState, useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useReactRouter from 'use-react-router'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import Sidebar from 'components/main/Sidebar/Sidebar'
import Header from 'components/main/Header/Header'
import CommonInfo from 'components/main/CommonInfo/CommonInfo'
import Accruals from 'components/main/Accruals/Accruals'
import Readings from 'components/main/Readings/Readings'
import SupportWindow from 'components/support/SupportWindow/SupportWindow'
import PayForm from 'components/main/PayForm/PayForm'
import PayHistory from 'components/main/PayHistory/PayHistory'
import ReadingsHistory from 'components/main/ReadingsHistory/ReadingsHistory'
import OldDevices from 'components/account/OldDevices/OldDevices'
import Docs from 'components/main/Docs/Docs'
import ChatIcon from 'assets/chat.svg'
import { getAccount, clearAccount } from 'services/account'
import { setDocsVisibilityAction, setSelectedReadingsDevice, loadDevices, loadObjects, setOldDeviceVisibilityAction } from 'actions/account'
import { post } from 'utils/api'


import s from './Main.css'

function Main() {
  const [supportShowed, setSupportShowed] = useState(false)
  const [payShowed, setPayShowed] = useState(false)
  const [historyShowed, setHistoryShowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const { match, history } = useReactRouter()  
  const account = useSelector(state => state.account)
  const docsShowed = useSelector(state => state.docsShowed)
  const oldDevicesShowed = useSelector(state => state.oldDevicesShowed)
  const selectedReadingsDevice = useSelector(state => state.selectedReadingsDevice)
  const dispatch = useDispatch()
  const requests = useSelector(state => state.requests)
  
  useEffect(() => {
    async function onLoad() {
      
      const account = await dispatch(getAccount(match.params.number))
      if (!account) {
        history.replace('/accounts')
        return
      }
      
      const data = { account_id: account.id, type: account.type === 1 ? 1 : 2 }
      
      const res = await post({ url: `account/counter/all`, data })
      const { success, response } = await res.json()
      if (success) {
        if (account.type === 3) {
          const res  = await post({ url: 'account/objects/all', data: { account_id: account.id }})
          const { success, response: response2 } = await res.json()
          if (success) {
            await dispatch(loadObjects(response2.objects))
          }
        } else {
          await dispatch(loadDevices(response.counts))
        }
        
      }
      setLoading(false)
    }
    onLoad()
    return () => dispatch(clearAccount())
  }, [])

  if (loading) {
    return null
  }

  if (!account) {
    return <Redirect to="/accounts" />
  }
  const path = `/account/${match.params.number}`
  
  return (
    <div className={s.container}>
      <Sidebar 
        onPay={() => setPayShowed(true)}
        onHistory={() => setHistoryShowed(true)}
        onDocs={() => dispatch(setDocsVisibilityAction({}))}
        onHelp={() => setHistoryShowed(true)}
        item={account}
      />
      <div className={s.content}>
        <Header item={account} path={path} />
        <div className={s.inner}>
          <Switch>
            <Route path={`${path}`} exact component={CommonInfo} />
            <Route path={`${path}/accruals`} exact component={Accruals} />
            {account.type !== 3 && <Route path={`${path}/readings`} exact component={Readings} />}
            
          </Switch>
          
        </div>
        <div className={s.footer}>
          © ПАО "Территориальная генерирующая компания N2" 2015-2019
        </div>
      </div>
      {requests && (
        <div className={s.chatIcon} onClick={() => setSupportShowed(true)}>
          {requests.some(r => r.new_response) ? <span /> : null}
          <p>
            Обратная связь
          </p>
          <ChatIcon />
        </div>
      )}
      
      <SupportWindow hidden={!supportShowed} onClose={() => setSupportShowed(false)} account={account} />
      <PayForm account={account} hidden={!payShowed} onClose={() => setPayShowed(false)} />
      <PayHistory hidden={!historyShowed} onClose={() => setHistoryShowed(false)} account={account} />
      <Docs year={docsShowed ? docsShowed.year : null} month={docsShowed ? docsShowed.month : null} account={account} hidden={!docsShowed} onClose={() => dispatch(setDocsVisibilityAction(null))} />
      <OldDevices hidden={!oldDevicesShowed} onClose={() => dispatch(setOldDeviceVisibilityAction(false))} />
      <ReadingsHistory 
        device={selectedReadingsDevice} 
        account={account}
        hidden={!selectedReadingsDevice} 
        onClose={() => dispatch(setSelectedReadingsDevice(null))} 
      />
    </div>
  )
}

export default withStyles(s)(Main)