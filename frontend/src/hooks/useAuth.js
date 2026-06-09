import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser, logoutUser, registerUser } from '../store/slices/authSlice'

const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth)

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials))
    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user.role
      if (role === 'customer') navigate('/customer/dashboard')
      else if (role === 'rider') navigate('/rider/dashboard')
      else if (role === 'admin') navigate('/admin/dashboard')
    }
  }

  const register = async (userData) => {
    const result = await dispatch(registerUser(userData))
    if (registerUser.fulfilled.match(result)) {
      const role = result.payload.user.role
      if (role === 'customer') navigate('/customer/dashboard')
      else if (role === 'rider') navigate('/rider/dashboard')
    }
  }

  const logoutHandler = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  return { user, isAuthenticated, loading, error, login, register, logout: logoutHandler }
}

export default useAuth