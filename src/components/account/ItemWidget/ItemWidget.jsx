import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import PencilIcon from 'assets/pencil.svg'

import s from './ItemWidget.css'

type Props = {
  item: any,
  active?: boolean,
  className?: string,
  onEdit?: Function,
  onDelete?: Function,
}

function ItemWidget(props: Props) {
  const { active, className, onDelete, onEdit, item } = props
  const [menuShowed, setMenuShowed] = useState(false)
  const el = useRef(null);

  useEffect(() => {
    const handler = e => {
      event.preventDefault();
      if (!el.current.contains(e.target)) {
        setMenuShowed(false);
      }
    }
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [menuShowed]);

  return (
    <div className={cx(s.container, className, { [s.active]: active })} ref={el}>
      <Link className={s.info} to={`/account/${item.number}`}>
        <div className={s.number}>
          {item.number}
          {item.is_archive && <span className={s.archive}>{item.type === 1 ? 'Архивный' : 'Расторгнутый'}</span>}
        </div>
        {item.name && <div className={s.name}>{item.name}</div>}
        <div className={s.address}>{item.address}</div>
      </Link>
      <PencilIcon className={s.icon} onClick={() => setMenuShowed(!menuShowed)} />
      {menuShowed && (
        <div className={s.menu}>
          <div onClick={() => onDelete()}>Удалить</div>
          <div onClick={() => onEdit()}>Ред. описание</div>
        </div>
      )}
      {active && (
        <div className={s.activeText}>
          <span>Текущий</span>
        </div>
      )}
    </div>
  )
}

export default withStyles(s)(ItemWidget)