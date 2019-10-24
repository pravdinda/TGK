import React, { useState } from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'

import s from './Slider.css'

type Props = {
  value?: boolean,
  onChange?: Function,
  label?: string,
  name?: string,
  outerClassName?: string,
  innerClassName?: string,
}

function Slider(props: Props) {
  const { label, value, onChange, name, outerClassName, innerClassName, ...anotherProps } = props
  return (
    <div 
      {...anotherProps}
      className={cx(s.container, outerClassName)} 
      onClick={() => onChange(!value)} 
    >
      <div className={cx(s.switcher, innerClassName, { [s.active]: value })}>
        <div />
      </div>
      <input type="checkbox" className={s.checkbox} name={name} />
      {label && <div className={s.label}>{label}</div>}
    </div>
  )
}

export default withStyles(s)(Slider)