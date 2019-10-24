import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import parser from 'bbcode-to-react'
import withStyles from 'isomorphic-style-loader/withStyles'
import Form from 'components/form/Form/Form'
import FormRow from 'components/form/FormRow/FormRow'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import Widget from 'components/account/DeviceReadingWidgetSmall/DeviceReadingWidgetSmall'
import ObjectWidget from 'components/account/ObjectWidget/ObjectWidget'
import ArrowIcon from 'assets/circle_arrow.svg'
import SpinnerIcon from 'assets/spinner.svg'
import ArrowIcon1 from 'assets/arrow_h.svg'
import ArrowIcon2 from 'assets/arrow.svg'
import { setOldDeviceVisibilityAction } from 'actions/account'
import { post } from 'utils/api'

import s from './CommonInfo.css'


function CommonInfo() {
  const account = useSelector(state => state.account)
  const devices = useSelector(state => state.devices)
  const objects = useSelector(state => state.objects)
  const filtered = devices ? devices.filter(d => d.reason_blocking !== 1) : null
  const dispatch = useDispatch()

  const [index, setIndex] = useState(0)
  const [notifications, setNotifications] = useState(null)
  const [ads, setAds] = useState(null)
  const [expanded, setExpanded] = useState(false)

  const oldShowed = !account.is_archive

  useEffect(
    () => {
      async function onLoad() {
        if (account.type === 3) {
          const res = await post({ url: `news/all`, body: {} })
          const { success, response } = await res.json()
          if (success) {
            setNotifications(response.news)
          }
        }
      }
      async function loadAds() {
        const res = await post({ url: `ad/all`, body: {} })
        const { success, response } = await res.json()
        if (success) {
          setAds(response.news)
        }
      }
      onLoad()
      loadAds()

    },
    []
  )

  const next = () => {
    if (index < objects.length - 1) {
      setIndex(index + 1)
    }
  }

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1)
    }
  }

  return (
    <div className={s.container}>
      {ads && ads.length && (
        <div className={s.ads}>
          {ads.map(n => <div key={n.id}>{parser.toReact(n.text)}</div>)}
        </div>
      )}
      {account.type === 1 && (
        <div className={s.left}>
          <Form className={s.form} title="Информация о владельце" width="100%">
            <FormRow>
              <FormRowTitle>ФИО</FormRowTitle>
              <div className={s.value}>{account.owner_name || '-'}</div>
            </FormRow>
            <FormRow>
              <FormRowTitle>Адрес</FormRowTitle>
              <div className={s.value}>{account.address || '-'}</div>
            </FormRow>
            <FormRow>
              <FormRowTitle>Общая площадь квартиры</FormRowTitle>
              <div className={s.value}>{account.total_area} м²</div>
            </FormRow>
            <FormRow>
              <FormRowTitle>Кол-во зарегистрированных</FormRowTitle>
              <div className={s.value}>{account.registered_count}</div>
            </FormRow>
            <FormRow>
              <FormRowTitle>Основание владения</FormRowTitle>
              <div className={s.value}>{account.ownership || '-'}</div>
            </FormRow>
          </Form>

          <Form className={s.form} width="100%">
            <FormRow>
              <FormRowTitle>Исполнитель коммунальных услуг</FormRowTitle>
              <div className={s.value}>
                {account.utility_company || '-'}
              </div>
            </FormRow>
            <FormRow>
              <FormRowTitle>Управляющая компания</FormRowTitle>
              <div className={s.value}>
                {account.management_company || '-'}
              </div>
            </FormRow>
          </Form>
          <div className={s.info}>
            Если информация не верна, Вы можете направить заявление с приложением копий подтверждающих документов через форму "Обратная связь". <a href="https://api-lk.tgc-2.ru/files/081019%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%20Web.pdf" target="_blank">Подробнее</a>
          </div>
        </div>
      )}

      {account.type === 3 && (
        <div className={s.left}>
          <Form className={s.form} title="Информация о контрагенте" width="100%">
            <FormRow>
              <FormRowTitle>Наименование</FormRowTitle>
              <div className={s.value}>{account.name || '-'}</div>
            </FormRow>
            <FormRow>
              <FormRowTitle>Юридический адрес</FormRowTitle>
              <div className={s.value}>{account.legal_address || '-'}</div>
            </FormRow>
            <FormRow>
              <FormRowTitle>Почтовый адрес</FormRowTitle>
              <div className={s.value}>{account.mail_address} м²</div>
            </FormRow>
            <FormRow>
              <FormRowTitle>Директор</FormRowTitle>
              <div className={s.value}>{account.director}</div>
            </FormRow>
            <FormRow>
              <FormRowTitle>Бухгалтер</FormRowTitle>
              <div className={s.value}>{account.accountant || '-'}</div>
            </FormRow>
            <FormRow>
              <FormRowTitle>Ответственные лица по договору</FormRowTitle>
              <div className={s.value}>{account.responsible_persons || '-'}</div>
            </FormRow>
          </Form>


          <div className={s.info}>
            Если информация не верна, Вы можете направить заявление с приложением копий подтверждающих документов через форму "Обратная связь". <a href="https://api-lk.tgc-2.ru/files/081019%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%20Web.pdf" target="_blank">Подробнее</a>
          </div>
        </div>
      )}

      <div className={s.right}>
        {account.type === 3 && (
          <Form className={s.form} title={<span>Информация об объектах<br />теплоснабжения</span>} width="100%">
            <div className={s.arrows}>
              <ArrowIcon1
                className={s.leftArrow}
                onClick={prev}
              />
              <ArrowIcon1
                className={s.rightArrow}
                onClick={next}
              />
            </div>
            {objects ? (
              objects.length ? (
                <div className={s.objects}>
                  <div style={{ width: objects.length * 450, transform: `translateX(-${450 * index}px)`  }}>
                    {objects.map((o, i) => <ObjectWidget key={o.id} index={i} data={o} />)}
                  </div>
                </div>
              ) : (
                <div className={s.empty}>Объекты отсутствуют</div>
              )
            ) : (
              <SpinnerIcon className={s.spinner} />
            )}
          </Form>
        )}
        {account.type === 3 && notifications && notifications.length && (
          <Form className={s.form} title="Уведомления теплоснабжающей организации" width="100%">
            <div className={cx(s.notifications, { [s.notificationsExpanded]: expanded })}>
              {notifications.map(n => <div key={n.id}>{parser.toReact(n.text)}</div>)}
            </div>
            <div className={s.notificationsBottom} onClick={() => setExpanded(!expanded)}>
              <span>{expanded ? 'Скрыть' : 'Читать полностью'}</span>
              <ArrowIcon2 className={cx({ [s.notificationsExpandedIcon]: expanded })} />
            </div>
          </Form>
        )}
        {account.type !== 3 && (
          <Form className={s.form} title="Информация о приборах учёта" width="100%">
            {filtered ? (
              <>
                {filtered.length ? (
                  filtered.map(r => (
                    <Widget key={r.id} data={r} className={s.widget} />
                  ))
                ) : (
                  <div className={s.empty}>Приборы учета отсутствуют</div>
                )}
                {oldShowed && <div className={s.previosDevices}>
                  <span onClick={() => dispatch(setOldDeviceVisibilityAction(true))}>
                    Ранее установленные ПУ <ArrowIcon />
                  </span>
                </div>}
              </>
            ) : (
              <SpinnerIcon className={s.spinner} />
            )}
          </Form>
        )}
      </div>
    </div>
  )
}

export default withStyles(s)(CommonInfo)