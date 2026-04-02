import { useState, useEffect } from 'react'
import axios from 'axios'

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) return
    axios
      .get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
      .then(res => setCountry({ found: true, data: res.data[0] }))
      .catch(() => setCountry({ found: false }))
  }, [name])

  return country
}

export default useCountry