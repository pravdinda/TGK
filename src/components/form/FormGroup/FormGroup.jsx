import React from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'

import s from './FormGroup.css'

type Props = {
  children: React.ReactElement,
  className?: string,
}

function FormGroup(props: Props) {
  const { children, className } = props
  return (
    <div className={cx(s.container, className)}>
      {children}
    </div>
  )
}

export default withStyles(s)(FormGroup)