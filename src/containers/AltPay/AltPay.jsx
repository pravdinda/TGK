import React, { useState } from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import Form from 'components/form/Form/Form'
import SberImage from 'assets/sber.png'
import VtbImage from 'assets/vtb.png'
import A3Image from 'assets/a3.png'
import ArrowIcon from 'assets/arrow_h.svg'

import s from './AltPay.css'

function AltPay() {
  return (
    <div className={s.container}>
      <Form title="Альтернативные способы оплаты:">
        <div className={s.rows}>
          <a className={s.row} target="_blank" href="https://online.sberbank.ru">
            <img src={SberImage} className={s.sber} />
            <ArrowIcon className={s.arrow} />
          </a>
          <a className={s.row} target="_blank" href="https://online.vtb.ru">
            <img src={VtbImage} className={s.vtb} />
            <ArrowIcon className={s.arrow} />
          </a>
        </div>
      </Form>
    </div>
  )
}

export default withStyles(s)(AltPay)