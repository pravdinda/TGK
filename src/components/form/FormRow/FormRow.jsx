import React from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'

import s from './FormRow.css'

type Props = {
  children?: React.ReactElement,
  className?: string,
}

function FormRow(props: Props) {
  const { className, children, ...otherProps } = props
  return (
    <div className={cx(s.container, className)} {...otherProps}>
      {children}
    </div>
  )
}

export default withStyles(s)(FormRow)