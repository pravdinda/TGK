import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toggleFailPay } from 'actions/common'

function FailPayment() {
  const dispatch = useDispatch()
  useEffect(
    () => {
      dispatch(toggleFailPay(true))    
    },
    []
  )
  let url = '/'
  const number = localStorage.getItem('account_number')
  localStorage.removeItem('account_number')
  if (number) {
    url = userInfo ? `/account/${number}` : `/guest-service/${btoa(number.toString() + 'KpuAqpyElg')}`
  }
  return <Redirect to={url} />
}

export default FailPayment