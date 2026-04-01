import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from './NotificationContext'
import Notification from './components/Notification'
import { getNotes, createNote, updateNote } from './requests'

const App = () => {
  const queryClient = useQueryClient()
  const [, dispatch] = useNotification()

  const showNotification = (message) => {
    dispatch({ type: 'SET', payload: message })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes
  })

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      showNotification(`note '${newNote.content}' added`)
    }
  })

  const toggleImportanceMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      showNotification(`note '${updatedNote.content}' updated`)
    }
  })

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: true })
  }

  const toggleImportance = (note) => {
    toggleImportanceMutation.mutate({ ...note, important: !note.important })
  }

  if (result.isLoading) return <div>loading...</div>

  const notes = result.data

  return (
    <div>
      <h2>Notes app</h2>
      <Notification />
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map(note => (
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content}
          <strong> {note.important ? 'important' : ''}</strong>
        </li>
      ))}
    </div>
  )
}

export default App