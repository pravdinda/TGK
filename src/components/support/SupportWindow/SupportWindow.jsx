// @flow
import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import moment from 'moment'
import withStyles from 'isomorphic-style-loader/withStyles'
import AddRequestForm from 'components/support/AddRequestForm/AddRequestForm'
import RequestMessages from 'components/support/RequestMessages/RequestMessages'
import CloseIcon from 'assets/close.svg'
import ArrowIcon from 'assets/arrow_h.svg'
import SpinnerIcon from 'assets/spinner.svg'
import Button from 'components/form/Button/Button'
import { post } from 'utils/api'
import { loadRequestsAction } from 'actions/account'

import s from './SupportWindow.css'

type Props = {
  onClose: Function,
  hidden: boolean,
  account: any,
}

function SupportWindow(props: Props) {
  const { onClose, hidden, account } = props
  const requests = useSelector(state => state.requests)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const dispatch = useDispatch()

  const accountId = useMemo(
    () =>  account ? account.id : 0,
    [account]
  )

  const accountType = useMemo(
    () =>  account ? account.type : 0,
    [account]
  )

  useEffect(
    () => {
      async function loadRequests() {
        let data = []
        if (accountId) {
          const res = await post({ url: 'requests/all', data: { type: accountType === 1 ? 1 : 2, account_id: accountId } })
          const { response: requests } = await res.json()
          data = requests
        }
        dispatch(loadRequestsAction(data))
      }
      loadRequests()
    },
    []
  )

  useEffect(
    () => {
      if (!hidden) {
        document.body.style.overflow = 'hidden'
      } else {
        setShowNewForm(false)
        setSelectedRequest(null)
        document.body.style.overflow = 'visible'
      }
    },
    [hidden]
  )

  useEffect(
    () => {
      return () => {
        document.body.style.overflow = 'visible'
      }
    },
    []
  )
  
  const onRequestAdd = request => {
    setSelectedRequest(request)
    setShowNewForm(false)
  }

  return (
    <div className={cx(s.container, { [s.hidden]: hidden } )}>
      <div className={s.overlay} />
      <div className={s.window}>
        <div className={s.title}>Обратная связь</div>
        <div className={s.content}>
          {showNewForm ? (
            <AddRequestForm 
              onAdd={onRequestAdd} 
              onClose={() => setShowNewForm(false)} 
              accountId={accountId}
              accountType={accountType}
            />
          ) : (
            selectedRequest ? (
              <RequestMessages 
                accountId={accountId}
                accountType={accountType}
                request={selectedRequest} 
                onClose={() => setSelectedRequest(null)} 
                onRequestUpdate={request => {
                  requests[requests.indexOf(selectedRequest)] = request
                  dispatch(loadRequestsAction([...requests]))
                }}
                onRequestCreate={request => {
                  setSelectedRequest(request)
                  dispatch(loadRequestsAction([...requests, request]))
                }}
              />
            ) : (
              <>
                <div className={s.requests}>
                  {requests ? (
                    <>
                      {requests.length === 0 && <div className={s.empty}>Нет обращений</div>}
                      {requests.length > 0 && requests.map(request => (
                        <div key={request.request_id} className={s.request} onClick={() => setSelectedRequest(request)}>
                          <div className={s.requestInner}>
                            <div className={s.requestDate}>{moment(request.updated_at).format('DD.MM.YYYY HH:mm')}</div>
                            <div className={s.requestTitle}>{request.request_name}</div>
                            <div className={s.requestText}>{request.last_message_text}</div>
                            {request.new_response && <div className={s.requestNewMessages} />}
                          </div>
                          <ArrowIcon />
                        </div>
                      ))}
                    </>
                  ) : <SpinnerIcon className={s.spinner} />}
                  
                </div>
                <div className={s.addRequestButton}>
                  <Button text="Новое обращение" fullWidth onClick={() => setShowNewForm(true)} />
                </div>
              </>
            )
          )}
        </div>
        <CloseIcon className={s.close} onClick={onClose} /> 
      </div>
    </div>
  )
}

export default withStyles(s)(SupportWindow)