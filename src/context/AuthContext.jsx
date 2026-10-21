/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback } from 'react'

export const AuthContext = createContext(null)


export function AuthProvider({ children }) {
  // Helper to load initial auth state safely from storage
  function getInitialAuth() {
    try {
      const localToken = localStorage.getItem('token')
      const localUser = localStorage.getItem('user')

      if (localToken) {
        return {
          token: localToken,
          user: localUser ? JSON.parse(localUser) : null,
          storageType: 'local',
        }
      }

      const sessionToken = sessionStorage.getItem('token')
      const sessionUser = sessionStorage.getItem('user')

      if (sessionToken) {
        return {
          token: sessionToken,
          user: sessionUser ? JSON.parse(sessionUser) : null,
          storageType: 'session',
        }
      }
    } catch {
      // In case of corrupt JSON, fall back safely
    }

    return { token: '', user: null, storageType: null }
  }

  const [auth, setAuth] = useState(getInitialAuth)

  const login = useCallback((authData, rememberMe) => {
    const accessToken = authData?.accessToken || authData?.token || ''

    // 1. Clear old auth data from both storages
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')

    const userObj = { ...authData }

    // 2. Persist strictly according to rememberMe
    if (rememberMe) {
      localStorage.setItem('token', accessToken)
      localStorage.setItem('user', JSON.stringify(userObj))
      setAuth({
        token: accessToken,
        user: userObj,
        storageType: 'local',
      })
    } else {
      sessionStorage.setItem('token', accessToken)
      sessionStorage.setItem('user', JSON.stringify(userObj))
      setAuth({
        token: accessToken,
        user: userObj,
        storageType: 'session',
      })
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')

    setAuth({
      token: '',
      user: null,
      storageType: null,
    })
  }, [])

  const updateUser = useCallback((updatedUser) => {
    setAuth((prev) => {
      // Persist user update only in the storage where the session belongs
      if (prev.storageType === 'local') {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      } else if (prev.storageType === 'session') {
        sessionStorage.setItem('user', JSON.stringify(updatedUser))
      }

      return {
        ...prev,
        user: updatedUser,
      }
    })
  }, [])

  const value = {
    token: auth.token,
    user: auth.user,
    isAuthenticated: Boolean(auth.token),
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
