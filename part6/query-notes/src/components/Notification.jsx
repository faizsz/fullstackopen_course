import { useNotification } from '../NotificationContext'

const Notification = () => {
  const [notification] = useNotification()
  if (!notification) return null
  return (
    <div style={{ border: '1px solid black', padding: 5, marginBottom: 10 }}>
      {notification}
    </div>
  )
}

export default Notification