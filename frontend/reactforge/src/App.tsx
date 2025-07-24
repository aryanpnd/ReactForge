import { useEffect } from "react"
import { useNavigate } from "react-router"
import useAuthStore from "@/store/authStore"
import Playground from "@/pages/playground/Playground"
import { Toaster } from "./components/ui/sonner"

function App() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null // or a loading spinner
  }

  return (
    <>
      <Toaster />
      <Playground />
    </>
  )
}

export default App