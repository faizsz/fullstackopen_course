import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import anecdoteService from '../services/anecdoteService'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    const sorted = [...state.anecdotes].sort((a, b) => b.votes - a.votes)
    if (!state.filter) return sorted
    return sorted.filter(a =>
      a.content.toLowerCase().includes(state.filter.toLowerCase())
    )
  })

  const handleVote = async (anecdote) => {
    const updated = { ...anecdote, votes: anecdote.votes + 1 }
    await anecdoteService.update(anecdote.id, updated)
    dispatch(vote(anecdote.id))
  }

  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList