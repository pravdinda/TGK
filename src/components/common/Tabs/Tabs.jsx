import React from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'

import s from './Tabs.css'

type Props = {
  tabs: Array<any>,
  onSelect?: Function,
  currentIndex: number,
  className?: string,
}

function Tabs(props: Props) {
  const { tabs, onSelect, currentIndex, className } = props
  return (<ul className={cx(s.tabs, className)}>
    {tabs.map((tab, index) => (
      <li 
        key={index}
        className={cx(s.tab, { [s.current]: currentIndex === index })}
        onClick={() => onSelect(index)}
      >{tab.label}</li>
    ))}
  </ul>)
}

export default withStyles(s)(Tabs)