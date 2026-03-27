const Notification = ({ message, type }) => {
    if (!message) return null
  
    const style = {
      color: type === 'error' ? 'red' : 'green',
      background: '#f0f0f0',
      fontSize: 16,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }
  
    return <div style={style}>{message}</div>
  }
  
  export default Notification