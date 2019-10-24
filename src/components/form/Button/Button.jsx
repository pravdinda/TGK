// @flow
import React from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import SpinnerIcon from 'assets/spinner.svg'

import s from './Button.css'

type Props = {
  text: string,
  className?: string,
  disabled?: boolean,
  fullWidth?: boolean,
  variant?: string,
  loading?: boolean,
}

function Button(props: Props) {
  const { className, fullWidth, variant, disabled, loading, onClick, ...anotherProps } = props
  const classNames = cx(
    s.button,
    className,
    {
      [s.fullWidth]: fullWidth,
      [s.outlined]: variant === 'outlined',
      [s.loading]: loading,
    }
  )
  return (
    <button 
      className={classNames} 
      onClick={e => {
        e.preventDefault()
        onClick && onClick(e)
      }}
      {...anotherProps} 
      disabled={disabled || loading}
    >
      {props.text}
      {loading && <SpinnerIcon />}
    </button>
  )
}

export default withStyles(s)(Button)