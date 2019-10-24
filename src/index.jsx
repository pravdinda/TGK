// import 'babel-polyfill'
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import StyleContext from 'isomorphic-style-loader/StyleContext'
import store from 'store'
import App from 'containers/App/App'


const root = document.getElementById('app')

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss())
  return () => removeCss.forEach(dispose => dispose())
}

render(
  <Provider store={store} >
    <StyleContext.Provider value={{ insertCss }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StyleContext.Provider>
  </Provider>,
  root,
)