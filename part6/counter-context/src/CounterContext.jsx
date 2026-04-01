import { createContext, useReducer, useContext } from 'react'

const CounterContext = createContext()

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'RESET':
      return 0
    default:
      return state
  }
}

export const CounterProvider = ({ children }) => {
  const [counter, dispatch] = useReducer(counterReducer, 0)
  return (
    <CounterContext.Provider value={[counter, dispatch]}>
      {children}
    </CounterContext.Provider>
  )
}

export const useCounter = () => useContext(CounterContext)

export default CounterContext