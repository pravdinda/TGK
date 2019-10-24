import React from 'react'
import withStyles from 'isomorphic-style-loader/withStyles'

import s from './FormInfo.css'

type Props = {
  children?: React.ReactElement,
}

function FormInfo(props: Props) {
  return (
    <div className={s.container}>
      {props.children}
    </div>
  )
}

export default withStyles(s)(FormInfo)