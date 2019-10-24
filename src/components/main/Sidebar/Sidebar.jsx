import React from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import { useDispatch } from 'react-redux'
import { formatCurrency } from 'utils/number'
import LogoImg from 'assets/logo.png'
import TextIcon from 'assets/text.svg'
import ClockIcon from 'assets/clock.svg'
import InfoIcon from 'assets/info.svg'
import Button from 'components/form/Button/Button'

import s from './Sidebar.css'

function Sidebar(props) {
  const { onPay, onHistory, onDocs, item } = props
  const dispatch = useDispatch()
  return (
    <div className={s.container}>
      <img className={s.logo} src={LogoImg} />
      {item.type !== 3 && (
        <div className={s.account}>
          <div className={s.title}>Состояние счёта</div>
          <div className={s.rows}>
            <div className={s.row}>
              <div className={s.label}>Долг на начало месяца</div>
              <div className={s.value}>{formatCurrency(item.debt_start_month)}</div>
            </div>
            <div className={s.row}>
              <div className={s.label}>Начислено</div>
              <div className={s.value}>{formatCurrency(item.accrued)}</div>
            </div>
            <div className={s.row}>
              <div className={s.label}>Оплачено в текущем месяце</div>
              <div className={s.value}>{formatCurrency(item.paid)}</div>
            </div>
            {item.fine ? (
              <div className={s.row}>
                <div className={s.label}>Пени</div>
                <div className={s.value}>{formatCurrency(item.fine)}</div>
              </div>
            ) : null}
            {item.state_duty ? (
              <div className={s.row}>
                <div className={s.label}>Госпошлина</div>
                <div className={s.value}>{formatCurrency(item.state_duty)}</div>
              </div>
            ) : null} 
          </div>
          <div className={s.total}>
            <div className={s.totalLabel}>К оплате</div>
            <div className={s.totalValue}>{formatCurrency(item.to_pay_f_s_d)}</div>
          </div>
          {item.to_pay_f_s_d > 0 && <Button className={s.button} text="Оплатить" onClick={onPay} />}
          
        </div>
      )}
      
      <div className={s.links}>
        <span className={s.link} onClick={onDocs}>
          <span><TextIcon /></span> Платежные документы
        </span>
        <span className={s.link} onClick={onHistory}>
          <span><ClockIcon /></span> История платежей
        </span>
        <a className={cx(s.link, s.info)} href="https://api-lk.tgc-2.ru/files/081019%20Руководство%20Web.pdf" target="_blank">
          <span><InfoIcon /></span> Справочная информация
        </a>
      </div>
    </div>
  )
}

export default withStyles(s)(Sidebar)