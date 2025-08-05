import {
  useUserStore
} from '@/store/useUserStore'
import {
  useEffect
} from 'react'
import {
  useNavigate,
  useLocation
} from 'react-router-dom'

const RequireAuth = ({ children }) => {
  const navigate = useNavigate()
  const { isLogin } = useUserStore()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!isLogin) {
      navigate('/login', { from: pathname })
    }
  }, [isLogin])

  return (
    <>
      {children}
    </>
  )
}

export default RequireAuth