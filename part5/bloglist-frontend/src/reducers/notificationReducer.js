const notificationReducer = (state = '', action) => {
    switch (action.type) {
      case 'SET_NOTIFICATION':
        return action.payload
      case 'CLEAR_NOTIFICATION':
        return ''
      default:
        return state
    }
  }
  
  export const setNotification = (message, seconds) => async (dispatch) => {
    dispatch({ type: 'SET_NOTIFICATION', payload: message })
    setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), seconds * 1000)
  }
  
  export default notificationReducer