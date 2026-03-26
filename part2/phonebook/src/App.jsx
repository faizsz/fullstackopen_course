import { useState, useEffect } from 'react'
import personsService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: 'success' })

  useEffect(() => {
    personsService.getAll().then(data => setPersons(data))
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: 'success' }), 3000)
  }

  const addPerson = (e) => {
    e.preventDefault()
    const existing = persons.find(p => p.name === newName)

    if (existing) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personsService
          .update(existing.id, { ...existing, number: newNumber })
          .then(updated => {
            setPersons(persons.map(p => p.id !== existing.id ? p : updated))
            showNotification(`Updated ${newName}`)
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            showNotification(`Information of ${newName} has already been removed from server`, 'error')
            setPersons(persons.filter(p => p.id !== existing.id))
          })
      }
      return
    }

    personsService
      .create({ name: newName, number: newNumber })
      .then(data => {
        setPersons(persons.concat(data))
        showNotification(`Added ${newName}`)
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showNotification(`Deleted ${name}`)
        })
        .catch(() => {
          showNotification(`${name} was already removed from server`, 'error')
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const filtered = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter filter={filter} onChange={e => setFilter(e.target.value)} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={e => setNewName(e.target.value)}
        newNumber={newNumber}
        onNumberChange={e => setNewNumber(e.target.value)}
      />
      <h3>Numbers</h3>
      <Persons persons={filtered} onDelete={deletePerson} />
    </div>
  )
}

export default App