// @flow
import React from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import CheckboxIcon from 'assets/checkbox.svg'
import CheckboxCheckedIcon from 'assets/checkbox-checked.svg'

import s from './Checkbox.css'

type Props = {
  className?: string,
  disabled?: boolean,
  checked?: boolean,
  children?: React.ReactElement,
  name?: string,
  onClick?: Function,
}

function Checkbox(props: Props) {
  const { className, checked, children, name, onChange, ...anotherProps } = props
  
  const Icon = checked ? CheckboxCheckedIcon : CheckboxIcon
  
  return (
    <div className={cx(s.container, className)}>
      <label htmlFor={name} className={s.label}>
        <input
          className={s.input}
          type="checkbox" 
          name={name}
          onClick={() => onChange(!checked)}
          {...anotherProps} 
        />
        <Icon className={s.icon} />
        {children && <span className={s.text}>{children}</span>}
      </label>
    </div>
  )
}

export default withStyles(s)(Checkbox)