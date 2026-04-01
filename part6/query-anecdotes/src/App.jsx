import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './services/anecdoteService'
import { useNotification } from './NotificationContext'
import Notification from './components/Notification'

const App = () => {
  const queryClient = useQueryClient()
  const [, dispatch] = useNotification()

  const showNotification = (message) => {
    dispatch({ type: 'SET', payload: message })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      showNotification(`you created '${newAnecdote.content}'`)
    }
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      showNotification(`you voted '${updatedAnecdote.content}'`)
    }
  })

  if (result.isLoading) return <div>loading...</div>

  const anecdotes = result.data

  const handleAdd = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate(content)
  }

  const handleVote = (anecdote) => {
    voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      {anecdotes.map(a => (
        <div key={a.id}>
          <div>{a.content}</div>
          <div>
            has {a.votes}
            <button onClick={() => handleVote(a)}>vote</button>
          </div>
        </div>
      ))}
      <h2>create new</h2>
      <form onSubmit={handleAdd}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App