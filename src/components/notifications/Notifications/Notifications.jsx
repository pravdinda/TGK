import React from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import Notification from 'components/notifications/Notification/Notification'

import s from './Notifications.css'

type Props = {
  className?: string
}

function Notifications(props: Props) {
  const { className, ...anotherProps } = props
  return (
    <div className={cx(s.container, className)} {...anotherProps}>
      <Notification />
    </div>
  )
}

export default withStyles(s)(Notifications)