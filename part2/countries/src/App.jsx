import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
      .then(res => setWeather(res.data))
  }, [capital])

  if (!weather) return <p>Loading weather...</p>

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetail = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>capital {country.capital?.[0]}</p>
    <p>area {country.area}</p>
    <h3>languages</h3>
    <ul>
      {Object.values(country.languages || {}).map(lang => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>
    <img src={country.flags.png} alt={`flag of ${country.name.common}`} width={150} />
    <Weather capital={country.capital?.[0]} />
  </div>
)

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => setCountries(res.data))
  }, [])

  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const renderResult = () => {
    if (search === '') return null
    if (filtered.length > 10) return <p>Too many matches, specify another filter</p>
    if (filtered.length === 1) return <CountryDetail country={filtered[0]} />
    return (
      <ul>
        {filtered.map(c => (
          <li key={c.name.common}>
            {c.name.common}
            <button onClick={() => setSearch(c.name.common)}>show</button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div>
      <div>find countries <input value={search} onChange={e => setSearch(e.target.value)} /></div>
      {renderResult()}
    </div>
  )
}

export default App