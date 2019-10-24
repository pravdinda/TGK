import React from 'react'
import withStyles from 'isomorphic-style-loader/withStyles'

import s from './FormError.css'

function FormError(props) {
  return (
    <div className={s.container}>{props.children}</div>
  )
}

export default withStyles(s)(FormError)