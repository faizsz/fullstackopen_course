import { useState } from 'react'
import useCountry from './hooks/useCountry'

const Country = ({ country }) => {
  if (!country) return null
  if (!country.found) return <div>not found...</div>
  return (
    <div>
      <h3>{country.data.name.common}</h3>
      <div>capital {country.data.capital?.[0]}</div>
      <div>population {country.data.population}</div>
      <img src={country.data.flags.png} height='100' alt={country.data.name.common} />
    </div>
  )
}

const App = () => {
  const [nameInput, setNameInput] = useState('')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input value={nameInput} onChange={e => setNameInput(e.target.value)} />
        <button>find</button>
      </form>
      <Country country={country} />
    </div>
  )
}

export default App