// @flow
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import InputMask from 'react-input-mask';
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import NumberFormat from 'react-number-format';
import EyeIcon from 'assets/eye.svg'
import Hint, { HintTypes } from 'components/common/Hint/Hint'

import s from './Input.css'

type Props = {
  className?: strin,
  inputClassName?: string,
  fullWidth?: boolean,
  icon?: React.ReactElement,
  type?: string,
  value?: any,
  action?: string,
  onAction?: Function,
  onChange?: Function,
  hint?: string,
  color?: InputColor,
  variant?: InputVariant,
}

export const InputType = {
  Text: 'text',
  Password: 'password',
  Phone: 'phone',
  Number: 'number',
  Email: 'email',
  Name: 'name',
  Login: 'login',
  Currency: 'currency',
}

export const InputColor = {
  Default: 'default',
  Error: 'error',
  Success: 'success',
  DefaultArrow: 'default',
}

export const InputVariant = {
  Outlined: 'outlined',
  Text: 'text',
}

function Input(props: Props) {
  const { 
    type, className, inputClassName, fullWidth, onChange, action, onAction, 
    hint, color,  variant, onHintClose, hintPosition,  ...anotherProps 
  } = props

  const inputVariant = variant || InputVariant.Outlined
  
  const [passwordShowed, setPasswordVisibility] = useState(false)

  let inputType = type

  if ([InputType.Name, InputType.Login, Input.Email].indexOf(type) >= 0) {
    inputType = 'text'
  }
  const hasIcon = inputType === InputType.Password

  if (passwordShowed) {
    inputType = InputType.Text
  }
  

  const inputClassNames = useMemo(
    () => cx(
      s.input, 
      inputClassName, 
      { 
        [s.fullWidth]: fullWidth,
      }
    ),
    [inputClassName, fullWidth]
  )

  const handler = useCallback(
    e => {
      let { value } = e.target
      if (type === InputType.Email) {
        // PREPARE
      }
      if (type === InputType.Number) {
        value = +value 
      }
      onChange && onChange(value)
    },
    [type]
  )
  

  let input = (
    <input 
      type={inputType}
      className={inputClassNames} 
      onChange={handler}
      {...anotherProps}
    />
  )
  
  if (type === InputType.Phone) {
    input = (
      <InputMask 
        className={inputClassNames}  
        mask="+7 (999) 999-99-99" 
        maskChar=" "
        onChange={handler}
        {...anotherProps}
      />
    )
  }

  if (type === InputType.Currency) {
    input = (
      <NumberFormat 
        className={inputClassNames} 
        thousandSeparator=" " 
        decimalScale={2}
        fixedDecimalScale
        onValueChange={val => {
          onChange && onChange(val.floatValue)
        }}
        {...anotherProps}
      />
    )
  }

  if (type === InputType.Number) {
    input = (
      <NumberFormat 
        className={inputClassNames} 
        thousandSeparator=""
        allowLeadingZeros
        onValueChange={val => {
          onChange && onChange(val.value)
        }}
        {...anotherProps}
      />
    )
  }

  if (type === InputType.Email) {
    <input 
      type="text"
      className={inputClassNames}
      onChange={handler}
      {...anotherProps}
    />
  }
  
  const classNames = cx(s.container, className, { 
    [s.withIcon]: hasIcon,
    [s.withAction]: !!action,
    [s.error]: color === InputColor.Error,
    [s.text]: inputVariant === InputVariant.Text,
    [s.outlined]: inputVariant === InputVariant.Outlined,
  })

  const content = (
    <div className={classNames}>
      {input}
      {hasIcon && (
        <EyeIcon
          className={s.icon}
          title={passwordShowed ? 'Спрятать пароль' : 'Показать пароль'}
          onClick={() => setPasswordVisibility(!passwordShowed)} 
        />
      )}
      {action && (
        <div className={s.action} onClick={onAction}>{action}</div>
      )}
    </div>
  )

  useEffect(
    () => {
      if (hint) {
        setTimeout(onHintClose, 5000)
      }
    },
    [hint]
  )

  return (
    <Hint hidden={!hint} position={hintPosition || 'right'} onClick={onHintClose} type={color || HintTypes.Default} text={hint}>
      {content}
    </Hint>
  ) 
}

Input.Type = InputType



export default withStyles(s)(Input)