import React, { useEffect, useState } from 'react'
import withStyles from 'isomorphic-style-loader/withStyles'
import { post } from 'utils/api'
import ArrowIcon from 'assets/arrow_h.svg'
import ArrowBigIcon from 'assets/arrow_b.svg'

import s from './AddRequestForm.css'

type Props = {
  onAdd: Function
}

function AddRequestForm(props: Props) {
  const { onAdd, onClose, accountId, accountType } = props
  const [topics, setTopics] = useState(null)

  useEffect(
    () => {
      async function onLoad() {
        const res = await post({ url: 'requests/topics' })
        const { response: topics } = await res.json()
        setTopics(topics.map(t => ({ ...t, id: +t.topic_id })))
      }
      onLoad()
    },
    []
  )
  return (
    <div className={s.container}>
      <div className={s.title}>
        Выберите тему
        <div className={s.back} onClick={onClose}>
          <ArrowBigIcon /> Назад
        </div>
      </div>
      <div className={s.topics}>
        {topics && topics.map(topic => (
          <div key={topic.id} className={s.topic} onClick={() => onAdd({ topic_id: topic.topic_id, request_name: topic.topic_title, isNew: true })}>
            {topic.topic_title}
            <ArrowIcon />
          </div>
        ))}
      </div>
    </div>
  )
}

export default withStyles(s)(AddRequestForm)