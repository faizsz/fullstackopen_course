const userReducer = (state = null, action) => {
    switch (action.type) {
      case 'SET_USER':
        return action.payload
      case 'CLEAR_USER':
        return null
      default:
        return state
    }
  }
  
  export const setUser = (user) => ({ type: 'SET_USER', payload: user })
  export const clearUser = () => ({ type: 'CLEAR_USER' })
  
  export default userReducer