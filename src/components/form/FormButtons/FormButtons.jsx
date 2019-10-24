import React from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'

import s from './FormButtons.css'

type Props = {
  children?: React.ReactElement,
  className?: string,
}

function FormButtons(props: Props) {
  return (
    <div className={cx(s.buttons, { [props.className]: !!props.className })}>
      {props.children}
    </div>
  )
}

export default withStyles(s)(FormButtons)

