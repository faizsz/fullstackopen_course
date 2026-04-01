import { useCounter } from '../CounterContext'

const Display = () => {
  const [counter] = useCounter()
  return <div>{counter}</div>
}

export default Display