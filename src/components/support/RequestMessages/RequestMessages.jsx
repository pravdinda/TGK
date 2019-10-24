// @flow
import React, { useState, useEffect, useRef, useMemo } from 'react'
import cx from 'classnames'
import withStyles from 'isomorphic-style-loader/withStyles'
import moment from 'moment'
import ArrowBigIcon from 'assets/arrow_b.svg'
import AttachIcon from 'assets/attach.svg'
import PlaneIcon from 'assets/plane.svg'
import SpinnerIcon from 'assets/spinner.svg'
import CloseIcon from 'assets/close.svg'
import FileIcon from 'assets/file.svg'
import { post } from 'utils/api'

import s from './RequestMessages.css'

type Request = {

}

type Props = {
  request: any;
  onClose: Function,
  onRequestCreate: Function,

}

function getTimeStr(date: Date) {
  return `${date.getHours()}:${date.getMinutes()}`
}

function RequestMessages(props: Props) {
  const { request, onClose, onRequestCreate, accountId, accountType, onRequestUpdate } = props
  const [messages, setMessages] = useState(null)
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputEl = useRef(null)
  const containerRef = useRef(null)

  useEffect(
    () => {
      async function onLoad() {
        setLoading(true)
        setMessages(null)
        const res = await post({ url: `requests/messages`, data: { request_id: request.request_id } })
        const { response, success } = await res.json()
        if (success) {
          setMessages(response)
        }
        setLoading(false)
      }

      async function markRead() {
        const res = await post({ url: `request/markasread/`, data: { request_id: request.request_id } })
        if (res.status === 200) {
          onRequestUpdate({ ...request, new_response: false })
        }
      }
      if (!request.isNew) {
        onLoad()
        if (request.new_response) {
          markRead()
          
        }
      }
    },
    [request.request_id]
  )

  useEffect(
    () => {
      const el = containerRef.current
      el.scrollTop = el.scrollHeight;
    },
    [messages]
  )

  const onFileSelect = e => {
    const file = e.target.files[0]
    if (file.size > 15000000) {
      setError(<span>Размер файла не должен превышать 15 Мб.<br />В случае необходимости разместите его на сервисе файлового обмена и приложите соответствующую ссылку</span>)
      return
    }
    setLoading(true)
    
    if (request.isNew) {
      const reader = new FileReader()
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const data = { 
          topic_id: request.topic_id, 
          message_type: 'file', 
          file_name: file.name,
          content: reader.result,
          account_id: accountId, 
          account_type: accountType === 1 ? 1 : 2,
        }
        const res = await post({ url: `requests/new`, data })
        const json = await res.json()
        if (json.success) {
          onRequestCreate({...json.response, isNew: false, request_name: request.request_name })
          setText('')
          setFile(null)
        } else {
          setError(json.error.description)
          return
        }
        setLoading(false)
      }
    } else {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const data = { request_id: request.request_id, file_name: file.name, content: reader.result, message_type: 'file' }
        const res = await post({ url: `request/message/new`, data })
        const json = await res.json()
        if (!json.success) {
          setError(json.error.description)
          return
        }
        const res1 = await post({ url: `requests/messages`, data: { request_id: request.request_id } })
        const { response: messages, success } = await res1.json()
        if (success) {
          setMessages(messages)
          setText('')
          setFile(null)
        }
        setLoading(false)
      }
    }
  }

  const fileSelector = useMemo(
    () => {
      const selector = document.createElement('input')
      selector.setAttribute('type', 'file')
      selector.setAttribute('accept', 'image/*,application/pdf')
      selector.addEventListener('change', onFileSelect)
      return selector
    },
    [request]
  )


  const onSend = async e => {
    if (e) {
      e.preventDefault()
    }
    setLoading(true)
    
    if (request.isNew) {
      const data = { 
        topic_id: request.topic_id, 
        message_type: 'text', 
        content: text,
        account_id: accountId, 
        account_type: accountType === 1 ? 1 : 2,
      }
      const res = await post({ url: `requests/new`, data })
      const json = await res.json()
      if (json.success) {
        onRequestCreate({...json.response, isNew: false, request_name: request.request_name })
        setText('')
        setFile(null)
      } else {
        setError(json.error.description)
        return
      }
      setLoading(false)
    } else {
      const data = { request_id: request.request_id, content: text, message_type: 'text' }
      const res = await post({ url: `request/message/new`, data })
      const json = await res.json()
      if (!json.success) {
        setError(json.error.description)
        return
      }
      const res1 = await post({ url: `requests/messages`, data: { request_id: request.request_id } })
      const { response: messages, success } = await res1.json()
      if (success) {
        setMessages(messages)
        setText('')
        setFile(null)
      }
      setLoading(false)
    } 
  }
  const onIconClick = () => {
    fileSelector.click()
  }

  
  return (
    <div className={s.container}>
      <div className={s.title}>
        {request.request_name}
        <div className={s.back} onClick={onClose}>
          <ArrowBigIcon /> Назад
        </div>
      </div>
      <div className={s.content}>
        <div className={s.messages} ref={containerRef}>
          {messages && messages.map(message => {
            const time = moment(message.time)
            const timeStr = time.isSame(new Date(), 'day') ? time.format('HH:mm') : time.format('DD.MM HH:mm')
            return (
              <div key={message.message_id} className={cx(s.message, { [s.messageClient]: message.sender === 'client' })}>
                <div className={s.messageText}>
                  {message.message_type === 'file' ? (
                    <a className={s.fileContent} target="_blank" href={message.file_url}>
                      <FileIcon className={s.fileTypeIcon} />
                      <span title={message.content}>{message.message}</span>
                    </a>
                  ) : message.message}
                </div>
                <div className={s.messageDate}>
                  {message.sender === 'client' && 'Доставлено | '}{timeStr}
                </div>
              </div>
            )}
          )}
        </div>
        <div className={s.messageForm}>
          <form>            
            <div className={s.fileIcon} onClick={onIconClick}>
              <AttachIcon />
            </div>
            <div className={s.messageFormAttachInfo}>
              Вы можете прикрепить несколько файлов.<br />
              Максимальный размер - 15 мб.
            </div>
            <input value={text} onChange={e => setText(e.target.value)} placeholder="Введите сообщение…" />
            <button onClick={onSend} disabled={loading || (!file && !text)}>
              {loading ? <SpinnerIcon className={s.spinner} /> : <PlaneIcon />}
            </button>
          </form>
          <p>
            При направлении обращения текущим должен быть именно тот лицевой<br />счет/договор, 
            по которому Вы направляете свое обращение или вопрос. <br /> 
            Чтобы приложить заявление к обращению, <a href="http://api-lk.tgc-2.ru/files/шаблоны_заявлений.pdf" target="_blank">скачайте бланк</a>, и прикрепите<br />скан-копию.
          </p>
        </div>
      </div>
      {error && (
        <>
          <div className={s.overlay} />
          <div className={s.error}>
            <h2>Ошибка загрузки</h2>
            <p>{error}</p>
            <div>
              <button onClick={() => setError(null)}>Ok</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default withStyles(s)(RequestMessages)