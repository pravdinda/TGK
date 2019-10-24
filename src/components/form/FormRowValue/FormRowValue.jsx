import React from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'

import s from './FormRowValue.css'

function FormRowValue(props) {
  return (
    <div className={cx(s.container, { [props.className]: props.className })}>
      {props.children}
    </div>
  )
}

export default withStyles(s)(FormRowValue)