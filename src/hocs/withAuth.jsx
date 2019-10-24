import React from 'react';
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function withAuth(Cmp) {
  function WithAuthCmp(props) {
    const userInfo = useSelector(state => state.userInfo)
    if (!userInfo) {
      return <Redirect to="/login" />
    }
    return <Cmp {...props} />
  }
  return WithAuthCmp;
}
