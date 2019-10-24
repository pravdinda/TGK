import React from 'react';
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from 'components/common/Header/Header'
import Footer from 'components/common/Footer/Footer'

export default function withGuest(Cmp) {
  function WithGuestCmp(props) {
    const userInfo = useSelector(state => state.userInfo)
    if (userInfo) {
      return <Redirect to="/accounts" />
    }
    return (
      <>
        <Header />
        <div style={{ 'minHeight': 'calc(100vh - 336px)' }}>
          <Cmp {...props} />
        </div>
        <Footer />
      </>
    );
  }
  return WithGuestCmp;
}
