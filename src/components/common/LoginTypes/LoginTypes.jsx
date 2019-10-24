import React from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import MobileIcon from 'assets/mobile.svg'
import MailIcon from 'assets/mail.svg'

import s from './LoginTypes.css'

type Props = {
  selectedType: string,
  onSelect: Function,
}

function LoginTypes(props: Props) {
  const { selectedType, onSelect } = props
  return (
    <div className={s.types}>
      <div
        onClick={() => onSelect('phone')}
        className={cx(s.type, { [s.selectedType]: selectedType === 'phone' } )}
      >
        <MobileIcon />
        Телефон
      </div>
      <div
        onClick={() => onSelect('email')}
        className={cx(s.type, { [s.selectedType]: selectedType === 'email' } )}
      >
        <MailIcon />
        Email
      </div>
    </div>
  )
}

export default withStyles(s)(LoginTypes)