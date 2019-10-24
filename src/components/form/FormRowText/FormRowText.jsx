import React from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'

import s from './FormRowText.css'

type Props = {
  children?: React.ReactElement,
  className?: string
}

function FormRowText(props: Props) {
  return (
    <div className={cx(s.container, props.className)}>
      {props.children}
    </div>
  )
}

export default withStyles(s)(FormRowText)