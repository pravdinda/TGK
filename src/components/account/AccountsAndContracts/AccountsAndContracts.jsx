import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import Button from 'components/form/Button/Button'
import AccountIcon from 'assets/account.svg'
import ContractIcon from 'assets/contract.svg'
import FailIcon from 'assets/fail.svg'
import ItemWidget from 'components/account/ItemWidget/ItemWidget'
import Form from 'components/form/Form/Form'
import FormInfo from 'components/form/FormInfo/FormInfo'
import FormButtons from 'components/form/FormButtons/FormButtons'
import Popup from 'components/common/Popup/Popup'
import ItemEditForm from 'components/account/ItemEditForm/ItemEditForm'
import AddItemForm from 'components/account/AddItemForm/AddItemForm'
import { getAccounts, deleteAccount } from 'services/account'
import { loadAccountsAction } from 'actions/account'
import SpinnerIcon from 'assets/spinner.svg'
import Icon from 'assets/icon.svg'
import SupportWindow from 'components/support/SupportWindow/SupportWindow'

import s from './AccountsAndContracts.css'


function AccountsAndContracts() {
  const [editedItem, setEditedItem] = useState(null)
  const [deletedItem, setDeletedItem] = useState(false)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showAddContract, setShowAddContract] = useState(false)
  const [isUsersExists, setIsUsersExists] = useState(null)
  const [isUsersExists1, setIsUsersExists1] = useState(null)
  const [loading, setLoading] = useState(true)
  const [supportShowed, setSupportShowed] = useState(false)
  const items = useSelector(state => state.accounts)
  const dispatch = useDispatch()
  
  useEffect(() => {
    async function onLoad() {
      await dispatch(getAccounts())
      setLoading(false)
    }
    onLoad()
  }, [])

  const onSave = useCallback(
    async (accounts, users, type) => {
      await dispatch(loadAccountsAction(accounts))
      setShowAddContract(false)
      setShowAddAccount(false)
      if (users && users.length > 0) {
        if (type === 'account') {
          setIsUsersExists(users)
        } else {
          setIsUsersExists1(users)
        }
        
      }
    },
    []
  )

  const onItemUpdate = async accounts => {
    await dispatch(loadAccountsAction(accounts))
    setEditedItem(null)
  }
  
  const deleteItem = async () => {
    try {
      await dispatch(deleteAccount(deletedItem))
    } catch(e) {}
    setDeletedItem(null)
  }

  if (!items) return null
  const accounts = items.filter(item => item.type === 1)
  const contracts = items.filter(item => item.type !== 1)
  const companies = {}
  contracts.forEach(contract => {
    if (!companies[contract.owner_name]) {
      companies[contract.owner_name] = []
    }
    companies[contract.owner_name].push(contract)
  })
  return (
    <div className={s.container}>
      {loading && (
        <div className={s.spinner}>
          <SpinnerIcon />
        </div>
      )}
      {!loading && (
        items.length === 0 ? (
          <div className={s.empty}>
            <Icon />
            <div className={s.emptyInfo}>
              <div className={s.emptyTitle}>К вашему личному кабинету<br />ещё не подключены лицевые<br />счета и договоры</div>
              <div className={s.emptyActions}>
                <Button text="Добавить лицевой счёт" fullWidth onClick={() => setShowAddAccount(true)} />
                <Button text="Добавить договор" fullWidth onClick={() => setShowAddContract(true)} />
                <Button text="Написать в поддержку" variant="outlined" fullWidth onClick={() => setSupportShowed(true)} />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={s.list}>
              <div className={s.column}>
                <div className={s.title}>
                  <AccountIcon />
                  Лицевые счета
                </div>
                <div className={s.org} />
                <div className={s.rows}>
                  {accounts.map(account => (
                    <ItemWidget 
                      item={account} 
                      key={account.id}
                      className={s.item}
                      onEdit={() => setEditedItem(account)}
                      onDelete={() => setDeletedItem(account)}
                    />
                  ))}
                </div>
              </div>
              <div className={s.column}>
                <div className={s.title}>
                  <ContractIcon />
                  Договоры
                </div>
                {Object.keys(companies).map(key => (
                  <div key={key} className={s.company}>
                    <div className={s.org}>{key}</div>
                    <div className={s.rows}>
                      {companies[key].map(contract => <ItemWidget 
                        className={s.item} 
                        item={contract} 
                        key={contract.id} 
                        onEdit={() => setEditedItem(contract)}
                        onDelete={() => setDeletedItem(contract)}
                      />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={cx(s.list, s.actions)}>
              <div className={s.column}>
                <Button className={s.button} variant="outlined" text="Добавить лицевой счёт" onClick={() => setShowAddAccount(true)} />
              </div>
              <div className={s.column}>
                <Button className={s.button} variant="outlined" text="Добавить договор"  onClick={() => setShowAddContract(true)}/>
              </div>
            </div>
          </>
        )
      )}
      {editedItem && <ItemEditForm item={editedItem} onClose={() => setEditedItem(null)} onSave={onItemUpdate} />}
      {deletedItem && (
        <Popup>
          <Form width="530px" title={`Удалить ${deletedItem.type === 1 ? 'счет' : 'договор'}`} Icon={FailIcon}>
            <FormInfo>
              {deletedItem.type === 1 ? (
                <>
                  Для повторного добавления лицевого счета потребуется актуальный код подключения. Вы точно хотите удалить лицевой счет №{deletedItem.number} из Вашего Личного кабинета?
                </>
              ) : (
                <>
                  Вы точно хотите удалить договор №{deletedItem.number}<br />из Вашего Личного кабинета?
                </>
              )}
            </FormInfo>
            <FormButtons>
              <Button onClick={() => setDeletedItem(null)} style={{ width: '180px', marginRight: 20 }} variant="outlined" text="Отмена" />
              <Button onClick={deleteItem} style={{ width: '230px' }} text="Удалить" />
            </FormButtons>
          </Form>
        </Popup>
      )}
      {showAddAccount && <AddItemForm type="account" onCancel={() => setShowAddAccount(false)} onSave={onSave} />}
      {showAddContract && <AddItemForm type="contract" onCancel={() => setShowAddContract(false)} onSave={onSave} />}
      <SupportWindow hidden={!supportShowed} onClose={() => setSupportShowed(false)} />
      {isUsersExists && (
        <Popup>
        <Form width="490px">
          <div className={s.popupTitle}>Лицевой счет уже подключен к кабинетам пользователей <span>{isUsersExists.map(u => `${u.login} (${u.name})`).join(', ')}</span></div>
          <FormInfo>
            Если Вы являетесь собственником помещения и не давали разрешения другим лицам на подключение Вашего лицевого счета к их Личному кабинету,
            просим оставить заявку по теме "Работа личного кабинета", прикрепив скан копии паспорта и свидетельства о праве собственности (договора найма)
          </FormInfo>
          <FormButtons>
            <Button onClick={() => setIsUsersExists(false)} style={{ width: '220px' }} text="Ok" />
          </FormButtons>
        </Form>
      </Popup>
      )}
      {isUsersExists1 && (
        <Popup>
        <Form width="490px">
          <div className={s.popupTitle}>Договор уже подключен к кабинетам пользователей <span>{isUsersExists1.map(u => `${u.login} (${u.name})`).join(', ')}</span></div>
          <FormInfo>
            Если Вы не давали разрешения другим лицам на подключение Вашего договора к Личному кабинету,
            то за консультацией для решения этого вопроса Вы можете обратиться к специалистам ПАО "ТГК-2".
          </FormInfo>
          <FormButtons>
            <Button onClick={() => setIsUsersExists1(false)} style={{ width: '220px' }} text="Ok" />
          </FormButtons>
        </Form>
      </Popup>
      )}
    </div>
  )
}

export default withStyles(s)(AccountsAndContracts)