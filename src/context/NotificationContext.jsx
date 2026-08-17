import { createContext, useState, useContext } from 'react'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0)

  const setUnread = (count) => {
    setUnreadCount(count)
  }

  const decrementUnread = () => {
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnread, decrementUnread }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
