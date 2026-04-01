import { useDispatch } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const AnecdoteFilter = () => {
  const dispatch = useDispatch()

  return (
    <div>
      filter <input onChange={(e) => dispatch(setFilter(e.target.value))} />
    </div>
  )
}

export default AnecdoteFilter