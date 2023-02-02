import React from 'react'
import reactDom from 'react-dom/client'
import style from './index.module.scss'

const App = ()　=> {
  return (
    <div className={style.text}>React web application</div>
  )
}

const root = reactDom.createRoot(document.getElementById('app') || document.body)
root.render(<App />)
