import { createContext, useState, useContext } from 'react'

const CustomerContext = createContext()

export function CustomerProvider({ children }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  return (
    <CustomerContext.Provider value={{ selectedCustomer, setSelectedCustomer }}>
      {children}
    </CustomerContext.Provider>
  )
}

export function useSelectedCustomer() {
  const context = useContext(CustomerContext)
  if (!context) {
    throw new Error('useSelectedCustomer must be used within CustomerProvider')
  }
  return context
}
