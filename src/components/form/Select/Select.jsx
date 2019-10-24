import React, { useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import ArrowIcon from 'assets/arrow.svg'

import s from './Select.css'

type Props = {
  options: Array<any>,
  onChange: Function,
  value?: any,
  placeholder?: string,
  fullWidth?: boolean,
}

function Select(props: Props) {
  const { options, onChange, value, placeholder, className, fullWidth } = props;
  const [expanded, setExpanded] = useState(false)
  const el = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (!el.current.contains(e.target)) {
        setExpanded(false);
      }
    }
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [expanded]);

  return (
    <div 
      className={cx(s.container, {
        [className]: className,
        [s.fullWidth]: fullWidth,
        [s.expanded]: expanded,
      })} 
      ref={el}
    >
      <div 
        onClick={() => setExpanded(!expanded)} 
        className={s.value}
      >
        {value ? value.value : placeholder}
        <ArrowIcon />
      </div>
      {expanded && (
        <div className={s.menu}>
          <div className={s.line} />
          <div className={s.list}>
            <ul className={s.options}>
              {options.map(o => (
                <li 
                  key={o.id}
                  className={cx(s.option, { [s.selected]: o === value })} 
                  onClick={() => {
                    setExpanded(false)
                    onChange(o)
                  }}
                >{o.value}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}


export default withStyles(s)(Select)