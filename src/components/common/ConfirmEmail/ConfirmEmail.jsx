import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setConfirmEmailVisibility } from 'actions/account'

function ConfirmEmail() {
  const dispatch = useDispatch()
  useEffect(
    () => {
      dispatch(setConfirmEmailVisibility(true))
    },
    []
  )
  return <Redirect to="/" />
}

export default ConfirmEmail