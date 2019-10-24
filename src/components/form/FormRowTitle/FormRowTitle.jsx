import React from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'

import s from './FormRowTitle.css'

type Props = {
  children?: React.ReactElement,
  className?: String,
}

function FormRowTitle(props: Props) {
  return (
    <div className={cx(s.container, props.className)}>
      {props.children}
    </div>
  )
}

export default withStyles(s)(FormRowTitle)