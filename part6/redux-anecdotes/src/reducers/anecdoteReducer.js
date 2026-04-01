const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE':
      return state.map(a =>
        a.id === action.payload.id ? { ...a, votes: a.votes + 1 } : a
      )
    case 'ADD_ANECDOTE':
      return [...state, action.payload]
    case 'INIT_ANECDOTES':
      return action.payload
    default:
      return state
  }
}

export const vote = (id) => ({
  type: 'VOTE',
  payload: { id }
})

export const addAnecdote = (content) => ({
  type: 'ADD_ANECDOTE',
  payload: content
})

export const initAnecdotes = (anecdotes) => ({
  type: 'INIT_ANECDOTES',
  payload: anecdotes
})

export default anecdoteReducer