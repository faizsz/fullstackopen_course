import ReactDOM from 'react-dom/client'
import { CounterProvider } from './CounterContext'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <CounterProvider>
    <App />
  </CounterProvider>
)