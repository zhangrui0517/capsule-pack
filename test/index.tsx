import React from 'react'
import ReactDOM from 'react-dom'
import Bar from './bar'
import './index.scss'

const App = () => {
  return (
    <div>
      Hello world
      <Bar/>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'))