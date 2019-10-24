import React, { useState } from 'react'
import withStyles from 'isomorphic-style-loader/withStyles'
import Popup from 'components/common/Popup/Popup'
import Input, { InputType, InputColor } from 'components/form/Input/Input'
import FormRow from 'components/form/FormRow/FormRow'
import FormRowTitle from 'components/form/FormRowTitle/FormRowTitle'
import Form from 'components/form/Form/Form'
import FormButtons from 'components/form/FormButtons/FormButtons'
import Button from 'components/form/Button/Button'
import { updateItemName } from 'api/account'

import s from './ItemEditForm.css'

type Props = {
  item: any,
  onClose: Function,
  onSave: Function,
}

function ItemEditForm(props: Props) {
  const { item, onClose, onSave } = props
  const [name, setName] = useState(item.name)
  const [loading, setLoading] = useState(false)
  const [showErrors, setErrorVisibility] = useState(false)
  const [errors, setErrors] = useState({})

  const save = async e => {
    e.preventDefault()
    setLoading(true)
    const res = await updateItemName(item, name)
    setLoading(false)
    const { response, success, error } = await res.json()
    const errors = {}
    if (success) {
      onSave(response.accounts)
    } else {
      errors.name = error.description
    
    }
    setErrorVisibility(true)
    setErrors(errors)
  }
  
  return (
    <Popup>
      <Form width="530px" title={`Редактировать описание ${item.type === 1 ? 'лицевого счета' : 'договора'} №${item.number}`}>
        <FormRow>
          <FormRowTitle>Краткое описание объекта</FormRowTitle>
          <Input 
            disabled={loading} 
            fullWidth 
            value={name} 
            onChange={setName} 
            color={showErrors && errors.name && InputColor.Error}
            hint={showErrors && errors.name}
            onHintClose={() => setErrors({ ...errors, name: null })}
          />
        </FormRow>
        <FormButtons>
          <Button onClick={onClose} className={s.cancelButton} variant="outlined" text="Отмена" />
          <Button onClick={save} className={s.saveButton} text="Сохранить" loading={loading} />
        </FormButtons>
      </Form>
    </Popup>
  )
}

export default withStyles(s)(ItemEditForm)