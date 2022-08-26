import React from 'react'
import ReactDOM from 'react-dom'
import Bar from './bar'
import './index.css'

const App = () => {
  return (
    <div>
      <Bar/>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'))