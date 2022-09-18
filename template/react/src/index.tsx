/**
 * React 模板，提供React相关的打包支持，可直接启动开发
 */
import React from 'react'
import ReactDOM from 'react-dom'

export interface IProps {}

const App = (props: IProps) => {
  return <div>Hello capsule</div>
}

ReactDOM.render(<App />, document.getElementById('root'))
