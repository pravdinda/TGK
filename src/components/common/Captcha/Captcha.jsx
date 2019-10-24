import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

type Props = {
  onChange: Function
}

const key = __DEV__ ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' : '6LeKW7oUAAAAAI-eoi_zge0IyD-DaxCj9eUstJnk'

function Captcha(props: Props) {
  if (props.hidden) {
    return <div style={{ width: 304, height: 78 }} />
  }
  return  <ReCAPTCHA sitekey={key} onChange={props.onChange} />
}

export default Captcha