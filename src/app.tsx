import { FC } from 'react'
import img from './asset/image/cat.jpg'

const App: FC = () => {
  return (
    <div>
      <img src={img} />
    </div>
  )
}

export default App