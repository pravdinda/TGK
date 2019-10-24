// @flow
import { useState } from 'react'
import validator from 'validator'

type Field = {
  name: string,
  type?: string,
  required?: boolean,
  initialValue?: any
}

export default function useForm(fieldsData: Array<Field>) {
  const fields = {}
  for (let field of fieldsData) {
    const [value, setValue] = useState(field.initialValue)
    let error
    
    fields[field.name] = { 
      value, 
      handler: setValue, 
      error, 
      required: field.required,
      type: field.type,
      name: field.name,
    }
  }

  return fields
}