import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import moment from 'moment'
import withStyles from 'isomorphic-style-loader/withStyles'
import CloseIcon from 'assets/close.svg'
import Form from 'components/form/Form/Form'
import FormRow from 'components/form/FormRow/FormRow'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import FormGroup from 'components/form/FormGroup/FormGroup'
import Button from 'components/form/Button/Button'
import Buttons from 'components/form/FormButtons/FormButtons'
import Select from 'components/form/Select/Select'
import Slider from 'components/form/Slider/Slider'
import MailIcon from 'assets/mail1.svg'
import DocsIcon from 'assets/docs1.svg'
import InfoIcon from 'assets/info.svg'
import FailIcon from 'assets/fail.svg'
import NatureIcon from 'assets/nature.svg'
import SuccessIcon from 'assets/success.svg'
import { post } from 'utils/api'

import s from './Docs.css'


type Props = {
  onClose: Function,
  hidden: boolean,
  account: any,
}

const years = []

for (let i = 2014; i <= new Date().getFullYear(); i++) {
  years.push({ id: i, value: i })
}

const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const months = [
  {
    id: 1,
    value: 'Январь'
  },
  {
    id: 2,
    value: 'Февраль'
  },
  {
    id: 3,
    value: 'Март'
  },
  {
    id: 4,
    value: 'Апрель'
  },
  {
    id: 5,
    value: 'Май'
  },
  {
    id: 6,
    value: 'Июнь'
  },
  {
    id: 7,
    value: 'Июль'
  },
  {
    id: 8,
    value: 'Август'
  },
  {
    id: 9,
    value: 'Сентябрь'
  },
  {
    id: 10,
    value: 'Октябрь'
  },
  {
    id: 11,
    value: 'Ноябрь'
  },
  {
    id: 12,
    value: 'Декабрь'
  }
]

function Docs(props: Props) {
  const { onClose, hidden, account } = props

  const [invoices, setInvoices] = useState([])
  const [isEInvoices, setIsEInvoices] = useState(false)
  const [isEInvoicesEmail, setIsEInvoicesEmail] = useState(false)
  const [year, setYear] = useState(years.find(y => y.id === props.year))
  const [month, setMonth] = useState(months.find(m => m.id === props.month))
  const [loading, setLoading] = useState(false)
  const [successShowed, setSuccessShowed] = useState(false)
  const [error, setError] = useState(null)
  const [deletedInvoice, setDeletedInvoice] = useState(null)
  const [natureShowed, setNatureShowed] = useState(null)
  const [natureEmailShowed, setNatureEmailShowed] = useState(null)
  const [emailShowed, setEmailShowed] = useState(false)
  const [email2Showed, setEmail2Showed] = useState(false)
  const [email3Showed, setEmail3Showed] = useState(false)
  const [emailRejectShowed, setEmailRejectShowed] = useState(false)
  const [electricSuccessShowed, setElectricSuccessShowed] = useState(false)
  const [electricConditionShowed, setElectricConditionShowed] = useState(false)
  const [emailConditionShowed, setEmailConditionShowed] = useState(false)
  const { email } = useSelector(state => state.userInfo)


  useEffect(
    () => {
      async function onLoad() {
        const fromDate = new Date(2014, 0)
        fromDate.setDate(fromDate.getDate() + 1)
        fromDate.setUTCHours(0)
        fromDate.setUTCMinutes(0)
        fromDate.setUTCSeconds(0)
        const toDate = new Date()
        toDate.setDate(toDate.getDate())
        toDate.setUTCHours(0)
        toDate.setUTCMinutes(0)
        toDate.setUTCSeconds(0)
        const data = {
          type: account.type === 1 ? 1 : 2,
          account_id: account.id,
          date_from: fromDate,
          date_to: toDate

        }
        const res = await post({ url: 'account/payment/invoice/all', data })
        const { response, success } = await res.json()
        if (success) {
          setInvoices(response.invoices)
          setIsEInvoices(response.is_e_invoices)
          setIsEInvoicesEmail(response.is_e_invoices_email)
        }

      }
      onLoad()
    },
    []
  )
  useEffect(
    () => {
      if (!hidden) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'visible'
      }
    },
    [hidden]
  )

  useEffect(
    () => {

      if (props.year) {
        setYear(years.find(y => y.id === props.year))
      }
      if (props.month) {
        setMonth(months.find(m => m.id === props.month))
      }
    },
    [props.month, props.year]
  )

  const onAdd = async e => {
    e.preventDefault()
    setLoading(true)
    const data = {
      type: account.type === 1 ? 1 : 2,
      account_id: account.id,
      year: year.id,
      month: month.id,
    }
    const res = await post({ url: 'account/payment/invoice/new', data })
    const { response, error, success } = await res.json()
    if (success) {
      setSuccessShowed(true)
      setInvoices(response.invoices)
      const res = await post({ url: 'account/payment/invoice/email', data: { ...data, email } })
      await res.json()

    } else {
      setError(error.description)
    }
    setLoading(false)
  }

  const onDelete = async e => {
    e.preventDefault()
    const data = {
      invoice_id: deletedInvoice.id,
      account_id: account.id,
      type: account.type === 1 ? 1 : 2,
    }
    const res = await post({ url: 'account/payment/invoice/delete', data })
    const { response, error, success } = await res.json()
    setDeletedInvoice(null)
    if (success) {
      setInvoices(response.invoices)
    } else {
      setError(error.description)
    }
  }

  const onElectronicSet = async e => {
    e.preventDefault()
    const data = {
      account_id: account.id,
      type: account.type === 1 ? 1 : 2,
    }
    const res = await post({ url: 'account/payment/subscribe/electronic/new', data })
    const { error, success } = await res.json()
    setElectricConditionShowed(false)
    if (success) {
      setIsEInvoices(true)
      setIsEInvoicesEmail(true)
    } else {
      setError(error.description)
    }
  }

  const onEmailSet = async set => {
    const data = {
      account_id: account.id,
      type: account.type === 1 ? 1 : 2,
    }
    if (set) {
      data.is_e_invoices = false
    }
    const url = set ? 'account/payment/subscribe/email/new' : 'account/payment/subscribe/email/delete'
    const res = await post({ url, data })
    const { response, error, success } = await res.json()
    setEmailShowed(false)
    setEmailRejectShowed(false)
    if (success) {
      setIsEInvoicesEmail(set)
    } else {
      setError(error.description)
    }
  }



  const onNatureSet = async () => {
    const data = {
      account_id: account.id,
      type: account.type === 1 ? 1 : 2,
      is_e_invoices: true
    }

    const url = 'account/payment/subscribe/email/new'
    const res = await post({ url, data })
    const { response, error, success } = await res.json()
    setEmailShowed(false)
    setEmailRejectShowed(false)
    setEmailConditionShowed(false)
    if (success) {
      setIsEInvoicesEmail(true)
      setIsEInvoices(true)
    } else {
      setError(error.description)
    }
  }


  return (
    <div className={cx(s.container, { [s.hidden]: hidden } )}>
      <div className={s.overlay} />
      <div className={s.window}>
        <CloseIcon className={s.close} onClick={onClose} />
        <div className={s.title}>Платежные документы</div>
        <div className={s.inner}>
          <div className={s.text}>
            Выберите период, за который Вы хотите заказать платежный документ.
          </div>
          <Form width="564px" className={s.form}>
            <FormGroup>
              <FormRow className={s.select}>
                <FormRowTitle>Месяц</FormRowTitle>
                <Select
                  fullWidth
                  value={month}
                  onChange={setMonth}
                  options={months}
                />
              </FormRow>
              <FormRow className={s.select}>
                <FormRowTitle>Год</FormRowTitle>
                <Select
                  fullWidth
                  options={years}
                  value={year}
                  onChange={setYear}
                />
              </FormRow>
            </FormGroup>
            <Buttons>
              <Button onClick={onAdd} disabled={!year || !month} loading={loading} fullWidth text="Заказать документ" />
            </Buttons>
          </Form>
          <div style={account.type === 3 ? { height: 144 } : null } className={s.settingsWrapper}>
            <div className={cx(s.settings, { [s.settingsEmail]: isEInvoicesEmail })}>
              <MailIcon className={s.settingsIcon} />
              <div className={s.settingsText}>
                Получение на<br />электронную почту
              </div>
              {isEInvoicesEmail && (
                <>
                  <InfoIcon className={s.settingsInfo} />
                  <div style={{ width: '308px' }} className={s.settingsInfoText}>
                    Оформлена подписка на ежемесячное<br />
                    получение платежных документов<br />
                    на эл. почту: <b>{email}</b>
                  </div>
                </>
              )}

              <Slider
                value={isEInvoicesEmail}
                onChange={value => {
                  if (value) {
                    if (account.type === 3) {
                      setEmailShowed(true)
                    } else if (account.type === 2) {
                      setEmail2Showed(true)
                    } else {
                      if (isEInvoices) {
                        setEmailShowed(true)
                      } else {
                        setNatureEmailShowed(true)
                      }
                    }

                  } else {
                    setEmailRejectShowed(true)
                  }
                }}
                label={isEInvoicesEmail ? 'Включено' : 'Включить'}
                outerClassName={s.settingsSwitcher}
                innerClassName={s.settingsSwitcherInner}
              />
            </div>
            {account.type !== 3 && (
              <div className={cx(s.settings, { [s.settingsE]: isEInvoices })}>
                <DocsIcon className={s.settingsIcon} />
                <div className={s.settingsText}>
                  Переход на электронную<br />версию документа
                </div>

                {isEInvoices && (
                  <>
                    <InfoIcon className={s.settingsInfo} />
                    <div style={{ width: '238px' }} className={s.settingsInfoText}>
                      По данному лицевому счету<br />оформлен переход на электронный платежный документ.{!isEInvoicesEmail && ' Для ежемесячного получения платежных документов на Вашу эл. почту необходимо оформить подписку'}
                    </div>
                  </>
                )}
                <Slider
                  value={isEInvoices}
                  onChange={value => {
                    if (account.type === 2) {
                      if (value) {
                        setEmail3Showed(true)
                      } else {
                        setError('Возврат на бумажную версию документа возможен только через обращения в Контакт-центр.')
                      }
                    } else {
                      if (value) {
                        setNatureShowed(true)
                      } else {
                        setError('Возврат на бумажную версию документа возможен только через обращения в Контакт-центр.')
                      }
                    }

                  }}
                  label={isEInvoices ? 'Оформлено' : 'Оформить'}
                  outerClassName={s.settingsSwitcher}
                  innerClassName={s.settingsSwitcherInner}
                />
              </div>
            )}

          </div>
          <div className={s.ready}>
            <div className={s.readyTitle}>Заказанные документы</div>
            <div className={s.readyResult}>
              <div className={s.head}>
                <div className={s.period}>Период</div>
                <div className={s.status}>Статус</div>
                <div className={s.email}>Email</div>
                <div className={s.download}>Скачать</div>
              </div>
              <div style={account.type === 3 ? { maxHeight: 'calc(100vh - 640px)' } : null } className={s.list}>
                {invoices.map(i => (
                  <div className={s.row} key={i.id}>
                    <div className={s.period}>{monthNames[i.month - 1]} {i.year}</div>
                    <div className={s.status}>
                      {i.state}<br />
                      <span>{moment(i.change).format('DD.MM.YYYY HH:mm')}</span>
                    </div>
                    <div className={s.email}>
                      {/* Заказано */}
                    </div>
                    <div className={s.download}>
                      {['Готов', 'Отправлен'].includes(i.state) && <a onClick={() => window.open(i.file_url, '_blank')} href={i.file_url} target="_blank">PDF</a>}

                    </div>
                    <CloseIcon onClick={() => setDeletedInvoice(i)} className={s.remove} />
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <>
           <div className={s.overlay1} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <span>Ошибка</span>
            </div>
            <div className={s.popupText}>
              {error}
            </div>
            <div className={s.popupButtons}>
              <Button fullWidth variant="outlined" text="Ok" onClick={() => setError(null)} />
            </div>
          </div>
        </>
      )}
      {successShowed && (
        <>
          <div className={s.overlay1} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <SuccessIcon />
              <span>Документ заказан</span>
            </div>
            <div className={s.popupText}>
              Заказанный документ за <b>{monthNames[month.id - 1]} {year.id}</b><br />скоро будет доступен в разделе <b>“Платежные докуметы”</b>
            </div>
            <div className={s.popupButtons}>
              <Button fullWidth variant="outlined" text="Ok" onClick={() => setSuccessShowed(false)} />
            </div>
          </div>
        </>
      )}
      {deletedInvoice && (
         <>
          <div className={s.overlay1} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <FailIcon />
              <span>Удалить документ</span>
            </div>
            <div className={s.popupText}>
              Вы точно хотите удалить платежный документ<br />за период {monthNames[deletedInvoice.month - 1]} {deletedInvoice.year}?
            </div>
            <div className={s.popupButtons}>
              <Button variant="outlined" text="Отмена" onClick={() => setDeletedInvoice(null)} />
              <Button text="Удалить" onClick={onDelete} />
            </div>
          </div>
        </>
      )}
      {natureShowed && (
         <>
          <div className={s.overlay1} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <NatureIcon />
              <span>Сбережем природу!</span>
            </div>
            <div className={s.popupText}>
              Совершив переход на электронные платежные документы, Вы отказываетесь от получения бумажных квитанций и будете получать их ежемесячно на эл. почту: <b>{email}</b>
            </div>
            <div className={s.popupButtons}>
              <Button variant="outlined" text="Отмена" onClick={() =>  setNatureShowed(false)} />
              <Button text="Перейти" onClick={() => {
                setNatureShowed(false)
                setElectricConditionShowed(true)
              }} />
            </div>
          </div>
        </>
      )}
      {natureEmailShowed && (
         <>
          <div className={s.overlay1} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <NatureIcon />
              <span>Сбережем природу!</span>
            </div>
            <div className={s.popupText}>
              Вы хотели бы отказаться от получения бумажных платежных документов и перейти полностью на электронный платежный документ?

            </div>
            <div className={s.popupButtons}>
              <Button variant="outlined" text="Пропустить" onClick={() => {
                setNatureEmailShowed(false)
                setEmailShowed(true)
              }} />
              <Button text="Перейти" onClick={() => {
                setNatureEmailShowed(false)
                setEmailConditionShowed(true)
              }}/>
            </div>
          </div>
        </>
      )}
      {emailShowed && (
         <>
          <div className={s.overlay1} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <span>Ежемесячное получение</span>
            </div>
            <div className={s.popupText}>
              Каждый месяц Вы будете получать платежные документы на электронную почту: <b>{email}</b>
            </div>
            <div className={s.popupButtons}>
              <Button variant="outlined" text="Отмена" onClick={() =>  setEmailShowed(false)} />
              <Button text="Ок" onClick={() => onEmailSet(true)} />
            </div>
          </div>
        </>
      )}
      {email2Showed && (
         <>
          <div className={s.overlay1} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <span>Ежемесячное получение</span>
            </div>
            <div className={s.popupText}>
              Для получения платежных документов на электронную почту необходимо заключить дополнительное соглашение с ПАО "ТГК-2".
            </div>

              <Button style={{ width: 200, }} text="Ок" onClick={() => setEmail2Showed(false)} />

          </div>
        </>
      )}
      {email3Showed && (
         <>
          <div className={s.overlay1} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <span>Отказ от печатной версии</span>
            </div>
            <div className={s.popupText}>
              Для получения платежных документов на электронную почту необходимо заключить дополнительное соглашение с ПАО "ТГК-2".
            </div>

              <Button style={{ width: 200, }} text="Ок" onClick={() => setEmail3Showed(false)} />

          </div>
        </>
      )}
      {emailRejectShowed && (
         <>
          <div className={s.overlay1} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <span>Отказ от подписки</span>
            </div>
            <div className={s.popupText}>
              Вы действительно хотите отказаться от ежемесячного получения платежных документов на эл. почту <b>{email}</b>?
            </div>
            <div className={s.popupButtons}>
              <Button variant="outlined" text="Отмена" onClick={() =>  setEmailRejectShowed(false)} />
              <Button text="Ок" onClick={() => onEmailSet(false)} />
            </div>
          </div>
        </>
      )}
      {electricSuccessShowed && (
        <>
          <div className={s.overlay1} />
          <div className={s.popup}>
            <div className={s.popupTitle}>
              <span>Оформлен переход на электронные платежные документы</span>
            </div>
            <div className={s.popupText}>
              По данному лицевому счету оформлен переход на эл. платежный документ. Для ежемесячного получения эл. платежного документа на Вашу эл. почту необходимо оформить подписку.
            </div>
            <div className={s.popupButtons}>
              <Button fullWidth variant="outlined" text="Ok" onClick={() =>  setElectricSuccessShowed(false)} />
            </div>
          </div>
        </>
      )}
      {electricConditionShowed && (
        <>
          <div className={s.overlay1} />
          <div className={s.popup} style={{ width: '720px' }}>
            <div className={s.popupTitle}>
              <span>Условия перехода на получение платежного документа в электронном виде и отказа от его печатной версии</span>
            </div>
            <div className={s.popupText}>
              Платежный документ для внесения платы за предоставление коммунальных услуг (далее по тексту - Платежный документ) может быть предоставлен в электронном виде только через автоматизированную систему самообслуживания - Личный кабинет ПАО "ТГК-2".<br /><br />
              Платежный документ, предоставленный в электронном виде, содержит информацию в соответствии с п. 69 "Правил предоставления коммунальных услуг собственникам и пользователям помещений в многоквартирных домах и жилых домов", утвержденных постановлением Правительства РФ от 06.05.2011г. № 354
              "О предоставлении коммунальных услуг собственникам и пользователям помещений в многоквартирных домах и жилых домов".<br /><br />
              Платежный документ, представленный в электронном виде, направляется
              в PDF-формате на электронный адрес, указанный в Личном кабинете ПАО "ТГК-2".<br /><br />
              Платежный документ, представленный в электронном виде, направляется
              в сроки, установленные действующим законодательством.<br /><br />
              Для отказа от получения печатной версии Платежного документа необходимо принять настоящие Условия. Последний Платежный документ в печатном виде будет направлен в месяце, следующем за месяцем оформления отказа.<br /><br />
              В случае необходимости возобновления получения печатной версии Платежного документа, необходимо нажать соответствующую кнопку в Личном кабинете. Печатная версия Платежного документа будет направлена в месяце, следующем
              за месяцем оформлением возврата.
            </div>
            <div className={s.popupButtons}>
              <Button variant="outlined" text="Отказаться" onClick={() =>  setElectricConditionShowed(false)} />
              <Button style={{ flexBasis: '240px', flexShrink: 0 }} text="Принять условия" onClick={onElectronicSet} />
            </div>
          </div>
        </>
      )}
      {emailConditionShowed && (
        <>
          <div className={s.overlay1} />
          <div className={s.popup} style={{ width: '720px' }}>
            <div className={s.popupTitle}>
              <span>Условия перехода на получение платежного документа в электронном виде и отказа от его печатной версии</span>
            </div>
            <div className={s.popupText}>
              Платежный документ для внесения платы за предоставление коммунальных услуг (далее по тексту - Платежный документ) может быть предоставлен в электронном виде только через автоматизированную систему самообслуживания - Личный кабинет ПАО "ТГК-2".<br /><br />
              Платежный документ, предоставленный в электронном виде, содержит информацию в соответствии с п. 69 "Правил предоставления коммунальных услуг собственникам и пользователям помещений в многоквартирных домах и жилых домов", утвержденных постановлением Правительства РФ от 06.05.2011г. № 354
              "О предоставлении коммунальных услуг собственникам и пользователям помещений в многоквартирных домах и жилых домов".<br /><br />
              Платежный документ, представленный в электронном виде, направляется
              в PDF-формате на электронный адрес, указанный в Личном кабинете ПАО "ТГК-2".<br /><br />
              Платежный документ, представленный в электронном виде, направляется
              в сроки, установленные действующим законодательством.<br /><br />
              Для отказа от получения печатной версии Платежного документа необходимо принять настоящие Условия. Последний Платежный документ в печатном виде будет направлен в месяце, следующем за месяцем оформления отказа.<br /><br />
              В случае необходимости возобновления получения печатной версии Платежного документа, необходимо нажать соответствующую кнопку в Личном кабинете. Печатная версия Платежного документа будет направлена в месяце, следующем
              за месяцем оформлением возврата.
            </div>
            <div className={s.popupButtons}>
              <Button variant="outlined" text="Отказаться" onClick={() =>  setEmailConditionShowed(false)} />
              <Button style={{ flexBasis: '240px', flexShrink: 0 }} text="Принять условия" onClick={onNatureSet} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default withStyles(s)(Docs)