// @flow
import React from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'


import s from './Hint.css'

export type HintType = 'default' | 'error' | 'success'

export const HintTypes = {
  Default: 'default',
  Error: 'error',
  Success: 'success',
}


type Props = {
  hidden?: boolean,
  className?: string,
  children: React.ReactElement,
  text: String,
  type: HintType,
}


function Hint(props: Props) {
  const { className, type, hidden, children, text, onClick, position } = props
  
  return (
    <div 
      className={cx(s.container, className, {
        [s.error]: type === HintTypes.Error,
        [s.success]: type === HintTypes.Success,
        [s.left]:  position === 'left',
      })}
      onClick={onClick}
    >
      {children}
      {!hidden && <div className={s.hint}>
        <svg className={s.icon} viewBox="0 0 150 100" width="100" height="100%" preserveAspectRatio="none">
          <path d="M 5,50 97.5,5 97.5,95 Z" fill="currentColor" />
        </svg>
        {text}
      </div>}
    </div>
  )
}

export default withStyles(s)(Hint)