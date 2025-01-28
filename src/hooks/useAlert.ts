import { AlertContext } from "@/provider/AlertProvider"
import { useContext } from "react"

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within a AlertProvider')
  }
  return context
}