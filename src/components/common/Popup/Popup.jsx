import React, { useEffect } from 'react'
import cx from 'classnames'
import CloseIcon from 'assets/close.svg'

import withStyles from 'isomorphic-style-loader/withStyles'

import s from './Popup.css'

type Props = {
  width?: number | string,
  className?: string,
  onClose?: Function,
  children?: React.ReactElement,
}

function Popup(props: Props) {
  const { witdth, onClose, className, children, ...anotherProps } = props

  useEffect(
    () => {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'visible'
      }
    },
    []
  )


  return (
    <>
      <div className={s.overlay} />
      <div className={cx(s.container, className)}>
        {onClose && <CloseIcon className={s.close} onClick={onClose} />}
        {children}
      </div>
    </>
  )
}

export default withStyles(s)(Popup)