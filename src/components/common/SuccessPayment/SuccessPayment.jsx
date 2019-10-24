import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSuccessPay } from 'actions/common'


function SuccessPayment() {
  const dispatch = useDispatch()
  const userInfo = useSelector(state => state.userInfo)
  useEffect(
    () => {
      dispatch(toggleSuccessPay(true))
    },
    []
  )
  let url = '/'
  const number = localStorage.getItem('account_number')
  localStorage.removeItem('account_number')
  console.log(userInfo, number)
  if (number) {
    url = userInfo ? `/account/${number}` : `/guest-service/${btoa(number.toString() + 'KpuAqpyElg')}`
  }
  console.log(url)
  return <Redirect to={url} />
}

export default SuccessPayment