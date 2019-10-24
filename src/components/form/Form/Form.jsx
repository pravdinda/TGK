// @flow
import React from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'

import s from './Form.css'

type Props = {
  title?: string,
  className?: string,
  onSubmit?: Function,
  children?: any,
  width?: string,
  Icon?: React.ReactElement,
}

function Form(props: Props) {
  const { title, className, width, Icon, ...anotherProps } = props
  const style = {}
  if (width) {
    style.width = width
  }
  return (
    <form style={style} className={cx(s.container, className)} {...anotherProps}>
      {title && <div className={s.top}>
        {Icon && <Icon className={s.icon} />}
        <div className={s.title}>{title}</div>
      </div>}
      {props.children}
    </form>
  )
}

export default withStyles(s)(Form)