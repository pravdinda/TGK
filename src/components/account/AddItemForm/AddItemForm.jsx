import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import withStyles from 'isomorphic-style-loader/withStyles'
import Popup from 'components/common/Popup/Popup'
import Input, { InputType, InputColor } from 'components/form/Input/Input'
import FormRow from 'components/form/FormRow/FormRow'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import FormGroup from 'components/form/FormGroup/FormGroup'
import Select from 'components/form/Select/Select'
import Form from 'components/form/Form/Form'
import FormInfo from 'components/form/FormInfo/FormInfo'
import FormButtons from 'components/form/FormButtons/FormButtons'
import Button from 'components/form/Button/Button'
import { addAccount } from 'api/account'

import s from './AddItemForm.css'

type Props = {
  type: string,
  onCancel: Function,
  onSave: Function,
}

function AddItemForm(props: Props) {
  const { type, onCancel, onSave } = props
  const [city, setCity] = useState(null)
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [showErrors, setErrorVisibility] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const cities = useSelector(state => state.cities)

  const citiesOptions = useMemo(
    () => cities.map(({ id, name: value }) => ({ id, value })),
    [cities]
  )

  const disabled = !number || !code || (type === 'contract' && !city)

  const save = async e => {
    e.preventDefault()
    setLoading(true)
    const res = await addAccount({ number, code, name, city_id: city && city.id })
    setLoading(false)
    const { response, success, error } = await res.json()
    const errors = {}
    if (success) {
      onSave(response.accounts, response.users, type)
    } else {
      const errText = error.error
      if (errText === 'invalid code') {
        errors.code = error.description
      } else if (['account not found', 'account added to the profile', 'contract not found', 'contract added to the profile'].includes(errText)) {
        errors.number = error.description
      }
    }
    setErrorVisibility(true)
    setErrors(errors)
  }

  return (
    <Popup>
      <Form width="600px" title={type === 'account' ? 'Добавление лицевого счёта' : 'Добавление договора'}>
        <FormInfo>
          {type === 'account' ? 
            'Введите номер лицевого счета, код подключения, указанный на квитанции и краткое описание объекта.'
            : 'Выберите город, введите номер договора, код подключения и краткое описание объекта.'}
        </FormInfo>
        {type === 'contract' && (
          <FormRow>
            <FormRowTitle>Выберите город из списка*</FormRowTitle>
            <Select disabled={loading} fullWidth options={[]} options={citiesOptions} onChange={setCity} value={city} />
          </FormRow>
        )}
        <FormGroup>
          <FormRow>
            <FormRowTitle>{type === 'account' ? 'Лицевой счёт' : 'Договор'}*</FormRowTitle>
            <Input 
              fullWidth 
              type={InputType.Number} 
              value={number} 
              onChange={setNumber} 
              disabled={loading}
              color={showErrors && errors.number && InputColor.Error}
              hint={showErrors && errors.number}
              hintPosition="left"
              onHintClose={() => setErrors({ ...errors, number: null })}
            />
          </FormRow>
          <FormRow>
            <FormRowTitle>Код подключения*</FormRowTitle>
            <Input 
              fullWidth 
              type={InputType.Text} 
              value={code} 
              onChange={setCode} 
              disabled={loading}
              color={showErrors && errors.code && InputColor.Error}
              hint={showErrors && errors.code}
              onHintClose={() => setErrors({ ...errors, code: null })}
            />
          </FormRow>
        </FormGroup>
        <FormRow style={{ marginTop: 26 }}>
            <FormRowTitle>Краткое описание объекта</FormRowTitle>
            <Input fullWidth value={name} onChange={setName} />
          </FormRow>
        <FormButtons>
          <Button 
            onClick={onCancel} 
            className={s.cancelButton} 
            variant="outlined" 
            text="Отмена"
            disabled={loading}
          />
          <Button 
            onClick={save} 
            className={s.saveButton} 
            text={`Добавить новый ${type === 'account' ? 'счет' : 'договор'}`} 
            disabled={disabled} 
            loading={loading}
          />
        </FormButtons>
      </Form>
    </Popup>
  )
}

export default withStyles(s)(AddItemForm)